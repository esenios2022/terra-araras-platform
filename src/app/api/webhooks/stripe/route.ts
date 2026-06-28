import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { sql } from "@/lib/db";

function mapStatus(status: Stripe.Subscription.Status): string {
  if (status === "active" || status === "trialing") return "active";
  if (status === "past_due" || status === "unpaid") return "past_due";
  return "canceled";
}

export async function POST(request: NextRequest) {
  const body = await request.text();
  const signature = request.headers.get("stripe-signature");

  let event: Stripe.Event;
  try {
    event = getStripe().webhooks.constructEvent(
      body,
      signature!,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Firma inválida" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.client_reference_id;
    if (userId) {
      await sql`
        insert into subscriptions (user_id, provider, provider_customer_id, provider_subscription_id, status)
        values (${userId}, 'stripe', ${session.customer as string}, ${session.subscription as string}, 'active')
        on conflict (provider_subscription_id)
        do update set status = 'active', updated_at = now()
      `;
      await sql`update users set subscription_status = 'active' where id = ${userId}`;
    }
  }

  if (
    event.type === "customer.subscription.updated" ||
    event.type === "customer.subscription.deleted"
  ) {
    const subscription = event.data.object as Stripe.Subscription;
    const status = mapStatus(subscription.status);

    const [existing] = await sql`
      select user_id from subscriptions where provider_subscription_id = ${subscription.id}
    `;

    await sql`
      update subscriptions set
        status = ${status},
        current_period_end = ${new Date(subscription.current_period_end * 1000).toISOString()},
        updated_at = now()
      where provider_subscription_id = ${subscription.id}
    `;

    if (existing?.user_id) {
      await sql`update users set subscription_status = ${status} where id = ${existing.user_id}`;
    }
  }

  return NextResponse.json({ received: true });
}

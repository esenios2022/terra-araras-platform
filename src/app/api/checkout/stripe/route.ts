import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { getStripe } from "@/lib/stripe";

export async function POST() {
  const session = await getSession();
  if (!session) return NextResponse.json({ error: "No autorizado" }, { status: 401 });

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

  const checkoutSession = await getStripe().checkout.sessions.create({
    mode: "subscription",
    customer_email: session.email,
    client_reference_id: session.userId,
    line_items: [{ price: process.env.NEXT_PUBLIC_STRIPE_PRICE_ID_MONTHLY!, quantity: 1 }],
    success_url: `${siteUrl}/dashboard?suscripcion=ok`,
    cancel_url: `${siteUrl}/dashboard?suscripcion=cancelada`,
  });

  return NextResponse.json({ url: checkoutSession.url });
}

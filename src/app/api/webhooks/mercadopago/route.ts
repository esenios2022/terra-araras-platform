import { NextRequest, NextResponse } from "next/server";
import { getMpPreApproval } from "@/lib/mercadopago";
import { sql } from "@/lib/db";

function mapStatus(status: string): string {
  if (status === "authorized") return "active";
  if (status === "paused") return "past_due";
  return "canceled";
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  const type = body?.type ?? request.nextUrl.searchParams.get("type");
  const preapprovalId = body?.data?.id ?? request.nextUrl.searchParams.get("data.id");

  if (type !== "subscription_preapproval" || !preapprovalId) {
    return NextResponse.json({ received: true });
  }

  const preapproval = await getMpPreApproval().get({ id: preapprovalId });
  const userId = preapproval.external_reference;
  if (!userId) return NextResponse.json({ received: true });

  const status = mapStatus(preapproval.status ?? "");

  await sql`
    insert into subscriptions (user_id, provider, provider_subscription_id, status)
    values (${userId}, 'mercadopago', ${preapproval.id}, ${status})
    on conflict (provider_subscription_id)
    do update set status = ${status}, updated_at = now()
  `;

  await sql`update users set subscription_status = ${status} where id = ${userId}`;

  return NextResponse.json({ received: true });
}

import { NextRequest, NextResponse } from "next/server";
import { getMpPreApproval } from "@/lib/mercadopago";
import { sql } from "@/lib/db";
import crypto from "crypto";

function verifySignature(req: NextRequest, dataId: string | null): boolean {
  const secret = process.env.MERCADOPAGO_WEBHOOK_SECRET;
  if (!secret) return true; // sin secret configurado, dejar pasar (modo legacy)

  const signature = req.headers.get("x-signature");
  const requestId = req.headers.get("x-request-id");
  if (!signature) return false;

  const parts = Object.fromEntries(
    signature.split(",").map((part) => {
      const [k, ...v] = part.split("=");
      return [k, v.join("=")];
    })
  );
  const ts = parts["ts"];
  const v1 = parts["v1"];
  if (!ts || !v1) return false;

  const template = `id:${dataId};request-id:${requestId};ts:${ts}`;
  const expected = crypto.createHmac("sha256", secret).update(template).digest("hex");

  try {
    return crypto.timingSafeEqual(Buffer.from(v1, "hex"), Buffer.from(expected, "hex"));
  } catch {
    return false;
  }
}

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

  if (!verifySignature(request, preapprovalId)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 });
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

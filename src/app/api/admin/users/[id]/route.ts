import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth/session";
import { sql } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const admin = await requireAdmin();
  if (!admin) return NextResponse.json({ error: "No autorizado" }, { status: 403 });

  const { id } = await params;
  const { access_status } = await request.json();

  if (access_status !== "approved" && access_status !== "pending") {
    return NextResponse.json({ error: "Estado inválido" }, { status: 400 });
  }

  await sql`update users set access_status = ${access_status} where id = ${id}`;
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return NextResponse.json({ error: "Faltan datos." }, { status: 400 });
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const [user] = await sql`
    select id, email, password_hash, role from users where email = ${normalizedEmail}
  `;

  if (!user || !(await verifyPassword(password, user.password_hash))) {
    return NextResponse.json({ error: "Email o contraseña incorrectos." }, { status: 401 });
  }

  await createSession({ userId: user.id, email: user.email, role: user.role });

  return NextResponse.json({ ok: true });
}

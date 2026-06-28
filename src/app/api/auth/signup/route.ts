import { NextResponse } from "next/server";
import { sql } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { createSession } from "@/lib/auth/session";

export async function POST(request: Request) {
  const { email, password, fullName } = await request.json();

  if (!email || !password || typeof password !== "string" || password.length < 6) {
    return NextResponse.json(
      { error: "Email y contraseña (mínimo 6 caracteres) son obligatorios." },
      { status: 400 }
    );
  }

  const normalizedEmail = String(email).trim().toLowerCase();

  const [existing] = await sql`select id from users where email = ${normalizedEmail}`;
  if (existing) {
    return NextResponse.json({ error: "Ya existe una cuenta con ese email." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const [user] = await sql`
    insert into users (email, password_hash, full_name)
    values (${normalizedEmail}, ${passwordHash}, ${fullName ?? null})
    returning id, email, role
  `;

  await createSession({ userId: user.id, email: user.email, role: user.role });

  return NextResponse.json({ ok: true });
}

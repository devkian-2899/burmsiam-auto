import { currentStaff, ensureAdmin, publicStaff, sameOrigin } from "../../../../lib/auth.mjs";
import { databaseAvailable, sql } from "../../../../lib/db.mjs";
import { hashPassword } from "../../../../lib/password.mjs";
import { validateStaff } from "../../../../lib/staff-rules.mjs";

async function requireAdmin() {
  const staff = await currentStaff();
  if (!staff) return { error: Response.json({ error: "Sign in first." }, { status: 401 }) };
  if (staff.role !== "Admin") return { error: Response.json({ error: "Only an Admin can manage accounts." }, { status: 403 }) };
  return { staff };
}

export async function GET() {
  if (!databaseAvailable()) return Response.json({ error: "The database is not connected yet." }, { status: 503 });
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  await ensureAdmin();
  const rows = await sql(
    "select id, name, username, email, phone, role from staff order by lower(name), id",
  );
  return Response.json({ staff: rows.map(publicStaff) });
}

export async function POST(request) {
  if (!sameOrigin(request)) return Response.json({ error: "The account was refused." }, { status: 403 });
  if (!databaseAvailable()) return Response.json({ error: "The database is not connected yet." }, { status: 503 });
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const body = await request.json().catch(() => ({}));
  const input = validateStaff(body, { passwordRequired: true });
  if (input.error) return Response.json({ error: input.error }, { status: 400 });
  try {
    const rows = await sql(
      `insert into staff (name, username, email, phone, role, password_hash)
       values ($1, $2, $3, $4, $5, $6)
       returning id, name, username, email, phone, role`,
      [input.name, input.username, input.email, input.phone, input.role, await hashPassword(input.password)],
    );
    return Response.json({ staff: publicStaff(rows[0]) }, { status: 201 });
  } catch (error) {
    if (error?.code === "23505") return Response.json({ error: "That username or email is already used." }, { status: 409 });
    throw error;
  }
}

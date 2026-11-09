import { clearStaffSessions, currentStaff, publicStaff, sameOrigin } from "../../../../../lib/auth.mjs";
import { databaseAvailable, sql } from "../../../../../lib/db.mjs";
import { hashPassword } from "../../../../../lib/password.mjs";
import { validateStaff } from "../../../../../lib/staff-rules.mjs";

async function requireAdmin() {
  const staff = await currentStaff();
  if (!staff) return { error: Response.json({ error: "Sign in first." }, { status: 401 }) };
  if (staff.role !== "Admin") return { error: Response.json({ error: "Only an Admin can manage accounts." }, { status: 403 }) };
  return { staff };
}

export async function GET(_request, context) {
  if (!databaseAvailable()) return Response.json({ error: "The database is not connected yet." }, { status: 503 });
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const { id } = await context.params;
  const rows = await sql(
    "select id, name, username, email, phone, role from staff where id = $1",
    [id],
  );
  if (!rows[0]) return Response.json({ error: "Account not found." }, { status: 404 });
  return Response.json({ staff: publicStaff(rows[0]) });
}

export async function PATCH(request, context) {
  if (!sameOrigin(request)) return Response.json({ error: "The account was refused." }, { status: 403 });
  if (!databaseAvailable()) return Response.json({ error: "The database is not connected yet." }, { status: 503 });
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const { id } = await context.params;
  const body = await request.json().catch(() => ({}));
  const input = validateStaff(body, { passwordRequired: false });
  if (input.error) return Response.json({ error: input.error }, { status: 400 });

  const current = await sql("select id, role from staff where id = $1", [id]);
  if (!current[0]) return Response.json({ error: "Account not found." }, { status: 404 });
  if (current[0].role === "Admin" && input.role !== "Admin") {
    const admins = await sql("select count(*)::int as count from staff where role = 'Admin'");
    if (Number(admins[0].count) <= 1) {
      return Response.json({ error: "Keep at least one Admin account." }, { status: 400 });
    }
  }

  try {
    const rows = await sql(
      `update staff
       set name = $1, username = $2, email = $3, phone = $4, role = $5
       where id = $6
       returning id, name, username, email, phone, role`,
      [input.name, input.username, input.email, input.phone, input.role, id],
    );
    if (input.password) {
      await sql("update staff set password_hash = $1 where id = $2", [await hashPassword(input.password), id]);
      await clearStaffSessions(id);
    }
    return Response.json({ staff: publicStaff(rows[0]) });
  } catch (error) {
    if (error?.code === "23505") return Response.json({ error: "That username or email is already used." }, { status: 409 });
    throw error;
  }
}

export async function DELETE(request, context) {
  if (!sameOrigin(request)) return Response.json({ error: "The account was refused." }, { status: 403 });
  if (!databaseAvailable()) return Response.json({ error: "The database is not connected yet." }, { status: 503 });
  const gate = await requireAdmin();
  if (gate.error) return gate.error;
  const { id } = await context.params;
  if (String(gate.staff.id) === String(id)) {
    return Response.json({ error: "You cannot delete the account you are using." }, { status: 400 });
  }
  const current = await sql("select id, role from staff where id = $1", [id]);
  if (!current[0]) return Response.json({ error: "Account not found." }, { status: 404 });
  if (current[0].role === "Admin") {
    const admins = await sql("select count(*)::int as count from staff where role = 'Admin'");
    if (Number(admins[0].count) <= 1) {
      return Response.json({ error: "Keep at least one Admin account." }, { status: 400 });
    }
  }
  await sql("delete from staff where id = $1", [id]);
  return Response.json({ ok: true });
}

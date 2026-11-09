import { clearStaffSessions, hashToken, sameOrigin } from "../../../../lib/auth.mjs";
import { databaseAvailable, sql } from "../../../../lib/db.mjs";
import { hashPassword } from "../../../../lib/password.mjs";

export async function POST(request) {
  if (!sameOrigin(request)) return Response.json({ error: "The reset was refused." }, { status: 403 });
  if (!databaseAvailable()) return Response.json({ error: "The database is not connected yet." }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const token = String(body.token || "");
  const password = String(body.password || "");
  const confirm = String(body.confirm || "");
  if (token.length < 20) return Response.json({ error: "This reset link is invalid or expired." }, { status: 400 });
  if (password.length < 8) return Response.json({ error: "Use at least 8 characters." }, { status: 400 });
  if (password !== confirm) return Response.json({ error: "The passwords do not match." }, { status: 400 });

  const rows = await sql(
    `select id, staff_id from password_resets
     where token_hash = $1 and used_at is null and expires_at > now()
     limit 1`,
    [hashToken(token)],
  );
  if (!rows[0]) return Response.json({ error: "This reset link is invalid or expired." }, { status: 400 });

  await sql("update staff set password_hash = $1 where id = $2", [await hashPassword(password), rows[0].staff_id]);
  await sql("update password_resets set used_at = now() where id = $1", [rows[0].id]);
  await clearStaffSessions(rows[0].staff_id);
  return Response.json({ ok: true });
}

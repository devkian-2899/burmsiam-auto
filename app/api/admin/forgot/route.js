import { ensureAdmin, hashToken, newToken, sameOrigin } from "../../../../lib/auth.mjs";
import { databaseAvailable, sql } from "../../../../lib/db.mjs";
import { mailConfigured, sendResetEmail } from "../../../../lib/mail.mjs";

export async function POST(request) {
  if (!sameOrigin(request)) return Response.json({ error: "The reset was refused." }, { status: 403 });
  if (!databaseAvailable()) return Response.json({ error: "The database is not connected yet." }, { status: 503 });
  if (!mailConfigured()) return Response.json({ error: "Reset email is not connected yet." }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const email = String(body.email || "").trim().toLowerCase();
  if (!email.includes("@")) return Response.json({ error: "Enter the account email." }, { status: 400 });

  await ensureAdmin();
  const rows = await sql(
    "select id, email from staff where lower(email) = $1 limit 1",
    [email],
  );
  if (rows[0]) {
    const token = newToken();
    const expires = new Date(Date.now() + 60 * 60 * 1000);
    await sql(
      "insert into password_resets (staff_id, token_hash, expires_at) values ($1, $2, $3)",
      [rows[0].id, hashToken(token), expires.toISOString()],
    );
    const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
    const proto = request.headers.get("x-forwarded-proto") || "https";
    await sendResetEmail({ to: rows[0].email, link: `${proto}://${host}/admin/reset?token=${token}` });
  }
  return Response.json({ ok: true, message: "If that email is on a staff account, a reset link is on its way." });
}

import { checkPassword, ensureAdmin, findByIdentity, openSession, sameOrigin, authConfigured } from "../../../../lib/auth.mjs";
import { databaseIssue, sql } from "../../../../lib/db.mjs";

export async function POST(request) {
  if (!sameOrigin(request)) return Response.json({ error: "Sign-in was refused." }, { status: 403 });
  const issue = databaseIssue();
  if (issue) return Response.json({ error: issue }, { status: 503 });
  if (!authConfigured()) return Response.json({ error: "Sign-in is not configured yet." }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const identity = String(body.identity || "").trim();
  const password = String(body.password || "");
  if (!identity || !password) {
    return Response.json({ error: "Enter your account and password." }, { status: 400 });
  }
  let staff;
  try {
    await ensureAdmin();
    if (await tooManyAttempts(identity)) {
      return Response.json({ error: "Too many tries. Wait a few minutes and try again." }, { status: 429 });
    }
    staff = await findByIdentity(identity);
  } catch {
    return Response.json({ error: "The database refused the connection. Check the Neon connection string on Vercel." }, { status: 503 });
  }
  if (!staff || !(await checkPassword(staff, password))) {
    await sql("insert into login_attempts (identity) values ($1)", [identity.toLowerCase().slice(0, 200)]);
    return Response.json({ error: "That sign-in does not match an account." }, { status: 401 });
  }
  await openSession(staff.id, Boolean(body.remember));
  return Response.json({ ok: true });
}

async function tooManyAttempts(identity) {
  await sql("delete from login_attempts where created_at < now() - interval '15 minutes'");
  const rows = await sql(
    `select count(*)::int as count from login_attempts
     where lower(identity) = lower($1) and created_at > now() - interval '15 minutes'`,
    [identity.slice(0, 200)],
  );
  return Number(rows[0]?.count || 0) >= 8;
}

import { checkPassword, ensureAdmin, findByIdentity, openSession, sameOrigin, authConfigured } from "../../../../lib/auth.mjs";
import { databaseAvailable } from "../../../../lib/db.mjs";

const attempts = new Map();

function limited(identity) {
  const key = identity.trim().toLowerCase();
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry || entry.reset < now) {
    attempts.set(key, { count: 1, reset: now + 15 * 60 * 1000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 8;
}

export async function POST(request) {
  if (!sameOrigin(request)) return Response.json({ error: "Sign-in was refused." }, { status: 403 });
  if (!databaseAvailable()) return Response.json({ error: "The database is not connected yet." }, { status: 503 });
  if (!authConfigured()) return Response.json({ error: "Sign-in is not configured yet." }, { status: 503 });

  const body = await request.json().catch(() => ({}));
  const identity = String(body.identity || "");
  const password = String(body.password || "");
  if (!identity.trim() || !password) {
    return Response.json({ error: "Enter your account and password." }, { status: 400 });
  }
  if (limited(identity)) {
    return Response.json({ error: "Too many tries. Wait a few minutes and try again." }, { status: 429 });
  }

  await ensureAdmin();
  const staff = await findByIdentity(identity);
  if (!staff || !(await checkPassword(staff, password))) {
    return Response.json({ error: "That sign-in does not match an account." }, { status: 401 });
  }
  await openSession(staff.id, Boolean(body.remember));
  return Response.json({ ok: true });
}

import { createHash, randomBytes, randomUUID } from "node:crypto";
import { cookies } from "next/headers";
import { databaseAvailable, sql } from "./db.mjs";
import { readEnv } from "./env.mjs";
import { hashPassword, verifyPassword } from "./password.mjs";
import { publicOrigin } from "./public-origin.mjs";
import {
  REMEMBER_SECONDS,
  SESSION_COOKIE,
  SESSION_SECONDS,
  readSession,
  signSession,
} from "./session-cookie.mjs";

export { publicOrigin };

export const ROLES = ["Admin", "Moderator", "Content Manager"];

export function sessionSecret() {
  return readEnv("BURMSIAM_SESSION_SECRET");
}

export function authConfigured() {
  return sessionSecret() !== "";
}

let bootstrap;

export async function ensureAdmin() {
  bootstrap ??= createFirstAdmin().catch((error) => {
    bootstrap = undefined;
    throw error;
  });
  await bootstrap;
}

async function createFirstAdmin() {
  const email = readEnv("BURMSIAM_ADMIN_EMAIL");
  const password = typeof process.env["BURMSIAM_ADMIN_PASSWORD"] === "string" ? process.env["BURMSIAM_ADMIN_PASSWORD"] : "";
  if (!email || password.length < 8) return;
  const existing = await sql("select id from staff limit 1");
  if (existing.length > 0) return;
  const name = readEnv("BURMSIAM_ADMIN_NAME") || "Admin";
  const username = email.split("@")[0] || "admin";
  await sql(
    `insert into staff (name, username, email, phone, role, password_hash)
     values ($1, $2, $3, '', 'Admin', $4)`,
    [name, username, email, await hashPassword(password)],
  );
}

export function publicStaff(row) {
  return {
    id: String(row.id),
    name: row.name,
    username: row.username,
    email: row.email,
    phone: row.phone,
    role: row.role,
  };
}

export async function findByIdentity(identity) {
  const value = identity.trim();
  if (!value) return null;
  const rows = await sql(
    `select id, name, username, email, phone, role, password_hash
     from staff
     where lower(username) = lower($1)
        or lower(email) = lower($1)
        or (phone <> '' and phone = $1)
     limit 1`,
    [value],
  );
  return rows[0] || null;
}

export async function openSession(staffId, remember) {
  const secret = sessionSecret();
  if (!secret) throw new Error("Sign-in is not configured.");
  const sid = randomUUID();
  const seconds = remember ? REMEMBER_SECONDS : SESSION_SECONDS;
  const expires = new Date(Date.now() + seconds * 1000);
  await sql(
    "insert into sessions (id, staff_id, expires_at, remember) values ($1, $2, $3, $4)",
    [sid, staffId, expires.toISOString(), Boolean(remember)],
  );
  const token = await signSession({ sid, exp: expires.getTime(), staffId: String(staffId) }, secret);
  const jar = await cookies();
  jar.set(SESSION_COOKIE, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: seconds,
  });
}

export async function currentStaff() {
  if (!authConfigured() || !databaseAvailable()) return null;
  await ensureAdmin();
  const jar = await cookies();
  const payload = await readSession(jar.get(SESSION_COOKIE)?.value, sessionSecret());
  if (!payload) return null;
  const rows = await sql(
    `select staff.id, staff.name, staff.username, staff.email, staff.phone, staff.role
     from sessions
     join staff on staff.id = sessions.staff_id
     where sessions.id = $1 and sessions.expires_at > now()`,
    [payload.sid],
  );
  return rows[0] ? publicStaff(rows[0]) : null;
}

export async function destroySession() {
  const jar = await cookies();
  const payload = await readSession(jar.get(SESSION_COOKIE)?.value, sessionSecret());
  if (payload?.sid && databaseAvailable()) {
    await sql("delete from sessions where id = $1", [payload.sid]);
  }
  jar.set(SESSION_COOKIE, "", { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/", maxAge: 0 });
}

export async function clearStaffSessions(staffId) {
  await sql("delete from sessions where staff_id = $1", [staffId]);
}

export function hashToken(token) {
  return createHash("sha256").update(token).digest("base64url");
}

export function newToken() {
  return randomBytes(32).toString("base64url");
}

export async function checkPassword(staff, password) {
  return verifyPassword(password, staff.password_hash);
}

export function sameOrigin(request) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (!origin || !host) return false;
  try {
    return new URL(origin).host === host;
  } catch {
    return false;
  }
}


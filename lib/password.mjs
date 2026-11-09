import { randomBytes, scrypt as scryptCallback, timingSafeEqual } from "node:crypto";
import { promisify } from "node:util";

const scrypt = promisify(scryptCallback);
const KEY_LEN = 32;

export async function hashPassword(password) {
  const salt = randomBytes(16);
  const key = await scrypt(password, salt, KEY_LEN);
  return `scrypt:${salt.toString("base64url")}:${key.toString("base64url")}`;
}

export async function verifyPassword(password, stored) {
  const [label, salt, key] = String(stored || "").split(":");
  if (label !== "scrypt" || !salt || !key) return false;
  const expected = Buffer.from(key, "base64url");
  const actual = await scrypt(password, Buffer.from(salt, "base64url"), expected.length);
  if (actual.length !== expected.length) return false;
  return timingSafeEqual(actual, expected);
}

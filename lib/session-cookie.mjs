const encoder = new TextEncoder();

function bytesToBase64Url(bytes) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replaceAll("=", "");
}

function base64UrlToBytes(value) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/") + "===".slice((value.length + 3) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

async function hmac(value, secret) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value));
  return bytesToBase64Url(new Uint8Array(signature));
}

function signaturesMatch(left, right) {
  const a = base64UrlToBytes(left);
  const b = base64UrlToBytes(right);
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let index = 0; index < a.length; index += 1) diff |= a[index] ^ b[index];
  return diff === 0;
}

export async function signSession(payload, secret) {
  const body = bytesToBase64Url(encoder.encode(JSON.stringify(payload)));
  const signature = await hmac(body, secret);
  return `${body}.${signature}`;
}

export async function readSession(token, secret) {
  if (!token || !secret) return null;
  const [body, signature] = String(token).split(".");
  if (!body || !signature) return null;
  let expected = "";
  try {
    expected = await hmac(body, secret);
  } catch {
    return null;
  }
  if (!signaturesMatch(signature, expected)) return null;
  try {
    const payload = JSON.parse(new TextDecoder().decode(base64UrlToBytes(body)));
    if (!payload?.sid || !payload?.exp || payload.exp < Date.now()) return null;
    return payload;
  } catch {
    return null;
  }
}

export const SESSION_COOKIE = "burmsiam_session";
export const REMEMBER_SECONDS = 60 * 60 * 24 * 30;
export const SESSION_SECONDS = 60 * 60 * 12;

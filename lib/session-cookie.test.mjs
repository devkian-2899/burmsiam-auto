import assert from "node:assert/strict";
import test from "node:test";
import { readSession, signSession } from "./session-cookie.mjs";

const secret = "test-session-secret";

test("a signed session can be read back", async () => {
  const token = await signSession({ sid: "abc", exp: Date.now() + 60_000, staffId: "4" }, secret);
  const payload = await readSession(token, secret);
  assert.equal(payload.sid, "abc");
  assert.equal(payload.staffId, "4");
});

test("a changed session is rejected", async () => {
  const token = await signSession({ sid: "abc", exp: Date.now() + 60_000 }, secret);
  const [body, signature] = token.split(".");
  assert.equal(await readSession(`${body}x.${signature}`, secret), null);
  assert.equal(await readSession(token, "other-secret"), null);
});

test("an expired session is rejected", async () => {
  const token = await signSession({ sid: "abc", exp: Date.now() - 1000 }, secret);
  assert.equal(await readSession(token, secret), null);
});

import assert from "node:assert/strict";
import test from "node:test";
import { hashPassword, verifyPassword } from "./password.mjs";

test("a password matches only its own hash", async () => {
  const hash = await hashPassword("correct-horse");
  assert.equal(await verifyPassword("correct-horse", hash), true);
  assert.equal(await verifyPassword("wrong-horse", hash), false);
  assert.equal(await verifyPassword("correct-horse", "not-a-hash"), false);
});

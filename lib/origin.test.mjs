import assert from "node:assert/strict";
import test from "node:test";
import { publicOrigin } from "./public-origin.mjs";

function requestFor(host) {
  return new Request("https://www.burmsiamauto.com/api/admin/forgot", {
    headers: { host, "x-forwarded-host": "evil.example" },
  });
}

test("reset links ignore a forged forwarded host", () => {
  assert.equal(publicOrigin(requestFor("www.burmsiamauto.com")), "https://www.burmsiamauto.com");
  assert.equal(publicOrigin(requestFor("evil.example")), "https://www.burmsiamauto.com");
  assert.equal(publicOrigin(requestFor("127.0.0.1:3847")), "http://127.0.0.1:3847");
});

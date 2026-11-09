import assert from "node:assert/strict";
import test from "node:test";
import { databaseIssue, databaseUrl } from "./database-url.mjs";

test("a Neon address is kept and the extra channel setting is removed", () => {
  process.env.BURMSIAM_DB_URL = "postgresql://user:secret@ep.neon.tech/burmsiamauto?sslmode=require&channel_binding=require";
  const url = new URL(databaseUrl());
  assert.equal(url.searchParams.get("sslmode"), "require");
  assert.equal(url.searchParams.get("channel_binding"), null);
  assert.equal(databaseIssue(), "");
});

test("a name in the value box is not treated as a database address", () => {
  process.env.BURMSIAM_DB_URL = "BURMSIAM_DB_URL";
  assert.match(databaseIssue(), /postgresql:\/\//);
});

test("an empty database address is reported on the live site", () => {
  const previous = process.env.NODE_ENV;
  process.env.NODE_ENV = "production";
  delete process.env.BURMSIAM_DB_URL;
  assert.equal(databaseIssue(), "The database is not connected yet.");
  if (previous === undefined) delete process.env.NODE_ENV;
  else process.env.NODE_ENV = previous;
});

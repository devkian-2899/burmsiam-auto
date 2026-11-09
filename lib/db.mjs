import { readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";
import { databaseIssue, databaseUrl } from "./database-url.mjs";

let pool;
let poolUrl = "";
let local;
let ready;

export function databaseConfigured() {
  return databaseIssue() === "";
}

export function databaseAvailable() {
  if (databaseConfigured()) return true;
  return process.env.NODE_ENV !== "production";
}

export { databaseIssue };

export async function sql(text, params = []) {
  await ensureSchema();
  const url = databaseUrl();
  if (url !== "") {
    const result = await connection(url).query(text, params);
    return result.rows;
  }
  const result = await (await local).query(text, params);
  return result.rows;
}

function connection(url) {
  if (!pool || poolUrl !== url) {
    pool = new pg.Pool({
      connectionString: url,
      max: 3,
      ssl: url.includes("neon.tech") ? { rejectUnauthorized: false } : undefined,
    });
    poolUrl = url;
  }
  return pool;
}

async function ensureSchema() {
  ready ??= applySchema().catch((error) => {
    ready = undefined;
    local = undefined;
    throw error;
  });
  await ready;
}

async function applySchema() {
  const raw = await readFile(path.join(process.cwd(), "db", "schema.sql"), "utf8");
  const schema = raw
    .split("\n")
    .filter((line) => !line.trim().startsWith("--"))
    .join("\n");
  const statements = schema
    .split(";")
    .map((statement) => statement.trim())
    .filter(Boolean);

  const url = databaseUrl();
  if (url !== "") {
    const client = await connection(url).connect();
    try {
      for (const statement of statements) await client.query(statement);
    } finally {
      client.release();
    }
    return;
  }

  const { PGlite } = await import("@electric-sql/pglite");
  const db = new PGlite();
  for (const statement of statements) await db.exec(statement);
  local = Promise.resolve(db);
}

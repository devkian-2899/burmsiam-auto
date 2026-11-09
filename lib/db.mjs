import { readFile } from "node:fs/promises";
import path from "node:path";
import pg from "pg";

const databaseUrl = process.env.BURMSIAM_DB_URL?.trim() ?? "";
let pool;
let local;
let ready;

export function databaseConfigured() {
  return databaseUrl !== "";
}

export function databaseAvailable() {
  if (databaseConfigured()) return true;
  return process.env.NODE_ENV !== "production";
}

export async function sql(text, params = []) {
  await ensureSchema();
  if (databaseUrl !== "") {
    pool ??= new pg.Pool({ connectionString: databaseUrl, max: 5 });
    const result = await pool.query(text, params);
    return result.rows;
  }
  const result = await (await local).query(text, params);
  return result.rows;
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

  if (databaseUrl !== "") {
    pool ??= new pg.Pool({ connectionString: databaseUrl, max: 5 });
    const client = await pool.connect();
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

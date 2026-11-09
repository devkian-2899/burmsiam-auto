import { readEnv } from "./env.mjs";

export function databaseUrl() {
  const raw = readEnv("BURMSIAM_DB_URL");
  if (!raw) return "";
  try {
    const url = new URL(raw);
    url.searchParams.delete("channel_binding");
    return url.toString();
  } catch {
    return raw;
  }
}

export function databaseIssue() {
  const url = databaseUrl();
  if (!url) return "The database is not connected yet.";
  if (!/^postgres(ql)?:\/\//i.test(url)) {
    return "The database value must be the Neon connection string. It starts with postgresql://.";
  }
  return "";
}

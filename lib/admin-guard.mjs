import { currentStaff, sameOrigin } from "./auth.mjs";
import { databaseAvailable } from "./db.mjs";

export async function requireStaff(request, { write = false } = {}) {
  if (write && request && !sameOrigin(request)) {
    return { error: Response.json({ error: "The change was refused." }, { status: 403 }) };
  }
  if (!databaseAvailable()) {
    return { error: Response.json({ error: "The database is not connected yet." }, { status: 503 }) };
  }
  const staff = await currentStaff();
  if (!staff) return { error: Response.json({ error: "Sign in first." }, { status: 401 }) };
  return { staff };
}

export function saved(error, message) {
  if (error?.code === "23505") return Response.json({ error: message }, { status: 409 });
  if (error?.code === "23503") return Response.json({ error: "Choose a program and a season from the lists." }, { status: 400 });
  throw error;
}

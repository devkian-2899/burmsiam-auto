import { destroySession, sameOrigin } from "../../../../lib/auth.mjs";

export async function POST(request) {
  if (!sameOrigin(request)) return Response.json({ error: "Log out was refused." }, { status: 403 });
  await destroySession();
  return Response.json({ ok: true });
}

import { requireStaff } from "../../../../lib/admin-guard.mjs";
import { youtubeInput } from "../../../../lib/content-rules.mjs";
import { clearYoutube, getYoutube, saveYoutube } from "../../../../lib/content-store.mjs";

export async function GET() {
  const gate = await requireStaff();
  if (gate.error) return gate.error;
  return Response.json({ youtube: await getYoutube() });
}

export async function PUT(request) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  const input = youtubeInput(await request.json().catch(() => ({})));
  if (input.error) return Response.json({ error: input.error }, { status: 400 });
  return Response.json({ youtube: await saveYoutube(input.link) });
}

export async function DELETE(request) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  await clearYoutube();
  return Response.json({ ok: true });
}

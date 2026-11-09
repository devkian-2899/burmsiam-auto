import { requireStaff, saved } from "../../../../../lib/admin-guard.mjs";
import { recordId, seasonInput } from "../../../../../lib/catalog-rules.mjs";
import {
  deleteSeason,
  getSeason,
  seasonEpisodeCount,
  updateSeason,
} from "../../../../../lib/catalog-store.mjs";

export async function GET(_request, context) {
  const gate = await requireStaff();
  if (gate.error) return gate.error;
  const id = recordId((await context.params).id);
  const season = id ? await getSeason(id) : null;
  if (!season) return Response.json({ error: "Season not found." }, { status: 404 });
  return Response.json({ season });
}

export async function PATCH(request, context) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  const id = recordId((await context.params).id);
  if (!id) return Response.json({ error: "Season not found." }, { status: 404 });
  const input = seasonInput(await request.json().catch(() => ({})));
  if (input.error) return Response.json({ error: input.error }, { status: 400 });
  try {
    const season = await updateSeason(id, input);
    if (!season) return Response.json({ error: "Season not found." }, { status: 404 });
    return Response.json({ season });
  } catch (error) {
    return saved(error, "That season and volume already exist.");
  }
}

export async function DELETE(request, context) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  const id = recordId((await context.params).id);
  if (!id || !(await getSeason(id))) return Response.json({ error: "Season not found." }, { status: 404 });
  if (await seasonEpisodeCount(id) > 0) {
    return Response.json({ error: "Remove the episodes in this season first." }, { status: 409 });
  }
  await deleteSeason(id);
  return Response.json({ ok: true });
}

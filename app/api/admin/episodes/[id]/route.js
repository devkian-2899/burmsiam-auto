import { requireStaff, saved } from "../../../../../lib/admin-guard.mjs";
import { episodeInput, recordId } from "../../../../../lib/catalog-rules.mjs";
import {
  deleteEpisode,
  getEpisode,
  getProgram,
  getSeason,
  updateEpisode,
} from "../../../../../lib/catalog-store.mjs";

export async function GET(_request, context) {
  const gate = await requireStaff();
  if (gate.error) return gate.error;
  const id = recordId((await context.params).id);
  const episode = id ? await getEpisode(id) : null;
  if (!episode) return Response.json({ error: "Episode not found." }, { status: 404 });
  return Response.json({ episode });
}

export async function PATCH(request, context) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  const id = recordId((await context.params).id);
  if (!id) return Response.json({ error: "Episode not found." }, { status: 404 });
  const input = episodeInput(await request.json().catch(() => ({})));
  if (input.error) return Response.json({ error: input.error }, { status: 400 });
  if (!(await getProgram(input.programId)) || !(await getSeason(input.seasonId))) {
    return Response.json({ error: "Choose a program and a season from the lists." }, { status: 400 });
  }
  try {
    const episode = await updateEpisode(id, input);
    if (!episode) return Response.json({ error: "Episode not found." }, { status: 404 });
    return Response.json({ episode });
  } catch (error) {
    return saved(error, "That episode could not be saved.");
  }
}

export async function DELETE(request, context) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  const id = recordId((await context.params).id);
  if (!id || !(await deleteEpisode(id))) return Response.json({ error: "Episode not found." }, { status: 404 });
  return Response.json({ ok: true });
}

import { requireStaff, saved } from "../../../../lib/admin-guard.mjs";
import { episodeInput } from "../../../../lib/catalog-rules.mjs";
import { getProgram, getSeason, insertEpisode, listEpisodes } from "../../../../lib/catalog-store.mjs";

export async function GET() {
  const gate = await requireStaff();
  if (gate.error) return gate.error;
  return Response.json({ episodes: await listEpisodes() });
}

export async function POST(request) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  const input = episodeInput(await request.json().catch(() => ({})));
  if (input.error) return Response.json({ error: input.error }, { status: 400 });
  if (!(await getProgram(input.programId)) || !(await getSeason(input.seasonId))) {
    return Response.json({ error: "Choose a program and a season from the lists." }, { status: 400 });
  }
  try {
    return Response.json({ episode: await insertEpisode(input) }, { status: 201 });
  } catch (error) {
    return saved(error, "That episode could not be saved.");
  }
}

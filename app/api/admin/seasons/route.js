import { requireStaff, saved } from "../../../../lib/admin-guard.mjs";
import { seasonInput } from "../../../../lib/catalog-rules.mjs";
import { insertSeason, listSeasons } from "../../../../lib/catalog-store.mjs";

export async function GET() {
  const gate = await requireStaff();
  if (gate.error) return gate.error;
  return Response.json({ seasons: await listSeasons() });
}

export async function POST(request) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  const input = seasonInput(await request.json().catch(() => ({})));
  if (input.error) return Response.json({ error: input.error }, { status: 400 });
  try {
    return Response.json({ season: await insertSeason(input) }, { status: 201 });
  } catch (error) {
    return saved(error, "That season and volume already exist.");
  }
}

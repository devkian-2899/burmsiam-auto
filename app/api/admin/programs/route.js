import { requireStaff, saved } from "../../../../lib/admin-guard.mjs";
import { programInput } from "../../../../lib/catalog-rules.mjs";
import { insertProgram, listPrograms } from "../../../../lib/catalog-store.mjs";

export async function GET() {
  const gate = await requireStaff();
  if (gate.error) return gate.error;
  return Response.json({ programs: await listPrograms() });
}

export async function POST(request) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  const input = programInput(await request.json().catch(() => ({})));
  if (input.error) return Response.json({ error: input.error }, { status: 400 });
  try {
    return Response.json({ program: await insertProgram(input) }, { status: 201 });
  } catch (error) {
    return saved(error, "That abbreviation is already used.");
  }
}

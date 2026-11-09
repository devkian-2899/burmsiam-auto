import { requireStaff, saved } from "../../../../../lib/admin-guard.mjs";
import { programInput, recordId } from "../../../../../lib/catalog-rules.mjs";
import {
  deleteProgram,
  getProgram,
  programEpisodeCount,
  updateProgram,
} from "../../../../../lib/catalog-store.mjs";

export async function GET(_request, context) {
  const gate = await requireStaff();
  if (gate.error) return gate.error;
  const id = recordId((await context.params).id);
  const program = id ? await getProgram(id) : null;
  if (!program) return Response.json({ error: "Program not found." }, { status: 404 });
  return Response.json({ program });
}

export async function PATCH(request, context) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  const id = recordId((await context.params).id);
  if (!id) return Response.json({ error: "Program not found." }, { status: 404 });
  const input = programInput(await request.json().catch(() => ({})));
  if (input.error) return Response.json({ error: input.error }, { status: 400 });
  try {
    const program = await updateProgram(id, input);
    if (!program) return Response.json({ error: "Program not found." }, { status: 404 });
    return Response.json({ program });
  } catch (error) {
    return saved(error, "That abbreviation is already used.");
  }
}

export async function DELETE(request, context) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  const id = recordId((await context.params).id);
  if (!id || !(await getProgram(id))) return Response.json({ error: "Program not found." }, { status: 404 });
  if (await programEpisodeCount(id) > 0) {
    return Response.json({ error: "Remove this program's episodes first." }, { status: 409 });
  }
  await deleteProgram(id);
  return Response.json({ ok: true });
}

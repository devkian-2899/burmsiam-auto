import { requireStaff, saved } from "../../../../../lib/admin-guard.mjs";
import { slideInput } from "../../../../../lib/content-rules.mjs";
import { recordId } from "../../../../../lib/catalog-rules.mjs";
import { deleteSlide, getSlide, updateSlide } from "../../../../../lib/content-store.mjs";

export async function GET(_request, context) {
  const gate = await requireStaff();
  if (gate.error) return gate.error;
  const id = recordId((await context.params).id);
  const slide = id ? await getSlide(id) : null;
  if (!slide) return Response.json({ error: "Slide not found." }, { status: 404 });
  return Response.json({ slide });
}

export async function PATCH(request, context) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  const id = recordId((await context.params).id);
  if (!id) return Response.json({ error: "Slide not found." }, { status: 404 });
  const input = slideInput(await request.json().catch(() => ({})));
  if (input.error) return Response.json({ error: input.error }, { status: 400 });
  try {
    const slide = await updateSlide(id, input);
    if (!slide) return Response.json({ error: "Slide not found." }, { status: 404 });
    return Response.json({ slide });
  } catch (error) {
    return saved(error, "That slide could not be saved.");
  }
}

export async function DELETE(request, context) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  const id = recordId((await context.params).id);
  if (!id || !(await deleteSlide(id))) return Response.json({ error: "Slide not found." }, { status: 404 });
  return Response.json({ ok: true });
}

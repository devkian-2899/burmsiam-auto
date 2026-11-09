import { requireStaff, saved } from "../../../../lib/admin-guard.mjs";
import { slideInput } from "../../../../lib/content-rules.mjs";
import { insertSlide, listSlides } from "../../../../lib/content-store.mjs";

export async function GET() {
  const gate = await requireStaff();
  if (gate.error) return gate.error;
  return Response.json({ slides: await listSlides() });
}

export async function POST(request) {
  const gate = await requireStaff(request, { write: true });
  if (gate.error) return gate.error;
  const input = slideInput(await request.json().catch(() => ({})));
  if (input.error) return Response.json({ error: input.error }, { status: 400 });
  try {
    return Response.json({ slide: await insertSlide(input) }, { status: 201 });
  } catch (error) {
    return saved(error, "That slide could not be saved.");
  }
}

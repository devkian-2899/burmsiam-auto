import { notFound } from "next/navigation";
import { Suspense } from "react";
import { site } from "../content/site";
import { publicSlides } from "../lib/public-home.mjs";
import { publicProgram } from "../lib/public-catalog.mjs";
import { Footer } from "./footer";
import { ProgramScreen } from "./program-screen";

export async function ProgramPage({ name }) {
  const [program, slides] = await Promise.all([publicProgram(name), publicSlides()]);
  if (!program) notFound();
  return (
    <>
      <ProgramScreen
        name={program.name}
        icon={program.icon}
        cover={program.cover}
        description={program.description}
        logo={site.headerLogo}
        volumes={program.volumes}
        hasLatest={slides.length > 0}
      />
      <Footer />
    </>
  );
}

export function ProgramRoute({ name }) {
  return (
    <Suspense fallback={<p className="program-empty">Loading episodes…</p>}>
      <ProgramPage name={name} />
    </Suspense>
  );
}

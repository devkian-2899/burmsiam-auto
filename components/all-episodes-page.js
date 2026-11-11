import { notFound } from "next/navigation";
import { Suspense } from "react";
import { site } from "../content/site";
import { publicAllEpisodes } from "../lib/public-catalog.mjs";
import { publicSlides } from "../lib/public-home.mjs";
import { Footer } from "./footer";
import { ProgramScreen } from "./program-screen";

const DESCRIPTION = "Every episode from every program, grouped by season and volume.";

export async function AllEpisodesPage() {
  const [catalog, slides] = await Promise.all([publicAllEpisodes(), publicSlides()]);
  if (!catalog) notFound();
  return (
    <>
      <ProgramScreen
        name="All Episodes"
        icon={site.logo}
        cover={site.covers[0] || ""}
        description={DESCRIPTION}
        logo={site.headerLogo}
        volumes={catalog.volumes}
        hasLatest={slides.length > 0}
      />
      <Footer />
    </>
  );
}

export function AllEpisodesRoute() {
  return (
    <Suspense fallback={<p className="program-empty">Loading episodes…</p>}>
      <AllEpisodesPage />
    </Suspense>
  );
}

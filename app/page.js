import { Suspense } from "react";
import { About } from "../components/about";
import { Contact } from "../components/contact";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Latest } from "../components/latest";
import { Programs } from "../components/programs";
import { site } from "../content/site";
import { driveSources, youtubeId } from "../lib/media.mjs";
import { publicProgramMarks } from "../lib/public-catalog.mjs";

export default function HomePage() {
  const slides = site.slides
    .filter((slide) => String(slide.image || "").trim())
    .map((slide) => ({
      title: slide.title,
      href: String(slide.href || "").trim(),
      image: driveSources(slide.image, [1280, 1920, 2560, 3840]),
    }));

  return (
    <>
      <Header name={site.name} logo={site.headerLogo} />
      <main>
        <Hero
          slogan={site.slogan}
          youtubeId={youtubeId(site.youtube)}
          covers={site.covers}
        />
        <About />
        <Latest slides={slides} />
        <Suspense fallback={<p className="program-empty">Loading programs…</p>}>
          <ProgramMarks />
        </Suspense>
        <Contact contact={site.contact} />
      </main>
      <Footer />
    </>
  );
}

async function ProgramMarks() {
  return <Programs items={await publicProgramMarks()} />;
}

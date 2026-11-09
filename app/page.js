import { Suspense } from "react";
import { About } from "../components/about";
import { Contact } from "../components/contact";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Latest } from "../components/latest";
import { Programs } from "../components/programs";
import { site } from "../content/site";
import { youtubeId } from "../lib/media.mjs";
import { publicSlides, publicYoutube } from "../lib/public-home.mjs";
import { publicProgramMarks } from "../lib/public-catalog.mjs";

export default function HomePage() {
  return (
    <>
      <Header name={site.name} logo={site.headerLogo} />
      <main>
        <Suspense fallback={<Hero slogan={site.slogan} youtubeId="" covers={site.covers} />}>
          <HomeFilm />
        </Suspense>
        <About />
        <Suspense fallback={<p className="program-empty">Loading the latest…</p>}>
          <HomeSlides />
        </Suspense>
        <Suspense fallback={<p className="program-empty">Loading programs…</p>}>
          <ProgramMarks />
        </Suspense>
        <Contact contact={site.contact} />
      </main>
      <Footer />
    </>
  );
}

async function HomeFilm() {
  return (
    <Hero
      slogan={site.slogan}
      youtubeId={youtubeId(await publicYoutube())}
      covers={site.covers}
    />
  );
}

async function HomeSlides() {
  return <Latest slides={await publicSlides()} />;
}

async function ProgramMarks() {
  return <Programs items={await publicProgramMarks()} />;
}

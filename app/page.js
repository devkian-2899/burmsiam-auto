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
import { localProgramMarks } from "../content/program-marks.js";
import { publicSlides, publicYoutube } from "../lib/public-home.mjs";
// import { publicProgramMarks } from "../lib/public-catalog.mjs";

export default function HomePage() {
  return (
    <>
      <Suspense fallback={<Header name={site.name} logo={site.headerLogo} hasLatest={false} />}>
        <HomeHeader />
      </Suspense>
      <main>
        <Suspense fallback={<Hero slogan={site.slogan} youtubeId="" covers={site.covers} />}>
          <HomeFilm />
        </Suspense>
        <About />
        <Suspense fallback={null}>
          <HomeSlides />
        </Suspense>
        <Programs items={localProgramMarks} />
        <Contact contact={site.contact} />
      </main>
      <Footer />
    </>
  );
}

async function HomeHeader() {
  const slides = await publicSlides();
  return <Header name={site.name} logo={site.headerLogo} hasLatest={slides.length > 0} />;
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
  const slides = await publicSlides();
  if (slides.length === 0) return null;
  return <Latest slides={slides} />;
}

// async function ProgramMarks() {
//   return <Programs items={await publicProgramMarks()} />;
// }

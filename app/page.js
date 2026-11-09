import { About } from "../components/about";
import { Contact } from "../components/contact";
import { Footer } from "../components/footer";
import { Header } from "../components/header";
import { Hero } from "../components/hero";
import { Latest } from "../components/latest";
import { Programs } from "../components/programs";
import { site } from "../content/site";
import { driveSources, youtubeId } from "../lib/media.mjs";

export default function HomePage() {
  const slides = site.slides
    .filter((slide) => String(slide.image || "").trim())
    .map((slide) => ({
      title: slide.title,
      href: String(slide.href || "").trim(),
      image: driveSources(slide.image, [1280, 1920, 2560, 3840]),
    }));

  const programs = site.programs.map((item, index) => ({
    name: item.name || `Program ${index + 1}`,
    href: item.href,
    // Drive turns these PNGs into black-backed JPEGs at 540px and below.
    image: driveSources(item.image, [720, 1080]),
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
        <Programs items={programs} />
        <Contact contact={site.contact} />
      </main>
      <Footer />
    </>
  );
}

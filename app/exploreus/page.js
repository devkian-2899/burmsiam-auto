import Link from "next/link";
import { exploreLinks, site } from "../../content/site";
import { EngineSound } from "../../components/engine-sound";
import { IconFacebook, IconInstagram, IconSite, IconTikTok, IconYouTube } from "../../components/icons";
import { Footer } from "../../components/footer";

const icons = {
  youtube: <IconYouTube />,
  instagram: <IconInstagram />,
  facebook: <IconFacebook />,
  tiktok: <IconTikTok />,
  site: <IconSite />,
};

export const metadata = {
  title: "Explore Us · BurmSiamAuto",
  description: "BurmSiam channels, socials, and the website in one place.",
};

export default function ExplorePage() {
  return (
    <div className="explore">
      <div className="explore-photo" aria-hidden="true" />
      <div className="explore-shade" aria-hidden="true" />
      <div className="explore-road" aria-hidden="true" />
      <EngineSound />
      <main className="explore-main">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="explore-logo" src={site.logo} alt="BurmSiamAuto" />
        <p className="explore-slogan">{site.slogan}</p>
        <ul className="explore-list">
          {exploreLinks.map((item) => {
            const external = item.href.startsWith("http");
            const body = (
              <>
                <span className="explore-icon">{icons[item.kind]}</span>
                <span className="explore-copy">
                  <strong>{item.name}</strong>
                  <small>{item.hint}</small>
                </span>
              </>
            );
            return (
              <li key={item.name}>
                {external ? (
                  <a className="explore-link" href={item.href} target="_blank" rel="noopener noreferrer">
                    {body}
                  </a>
                ) : (
                  <Link className="explore-link" href={item.href}>
                    {body}
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </main>
      <Footer />
    </div>
  );
}

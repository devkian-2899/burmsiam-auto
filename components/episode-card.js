import {
  IconFacebook,
  IconInstagram,
  IconPostCarousel,
  IconPostReel,
  IconPostVideo,
  IconTikTok,
  IconYouTube,
} from "./icons";
import { Photo } from "./photo";

const SOCIALS = [
  { key: "youtubeUrl", label: "YouTube", Icon: IconYouTube },
  { key: "facebookUrl", label: "Facebook", Icon: IconFacebook },
  { key: "instagramUrl", label: "Instagram", Icon: IconInstagram },
  { key: "tiktokUrl", label: "TikTok", Icon: IconTikTok },
];

function PostTypeIcon({ postType }) {
  const code = String(postType || "").trim().toLowerCase();
  if (!code) return null;
  if (code === "reel" || code === "reels") {
    return (
      <span className="episode-post-type" title="Reels">
        <IconPostReel />
        <span className="visually-hidden">Reels</span>
      </span>
    );
  }
  if (code === "vdeo" || code === "video") {
    return (
      <span className="episode-post-type" title="Video">
        <IconPostVideo />
        <span className="visually-hidden">Video</span>
      </span>
    );
  }
  if (code === "caro" || code === "carousell") {
    return (
      <span className="episode-post-type" title="Carousell">
        <IconPostCarousel />
        <span className="visually-hidden">Carousell</span>
      </span>
    );
  }
  return null;
}

function SocialRow({ episode }) {
  return (
    <div className="episode-social" aria-label="Where to watch">
      {SOCIALS.map(({ key, label, Icon }) => {
        const href = episode[key];
        if (href) {
          return (
            <a
              key={key}
              className="episode-social-link is-active"
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
            >
              <Icon />
            </a>
          );
        }
        return (
          <span key={key} className="episode-social-link is-muted" aria-hidden="true">
            <Icon />
            <span className="visually-hidden">{label} unavailable</span>
          </span>
        );
      })}
    </div>
  );
}

export function EpisodeCard({ episode }) {
  return (
    <article className="episode-card">
      <div className="episode-photo">
        <Photo src={episode.image} alt="" className="episode-photo-img" />
      </div>
      <h3>{episode.title}</h3>
      <div className="episode-body">
        <PostTypeIcon postType={episode.postType} />
        {episode.description ? <p className="episode-copy">{episode.description}</p> : null}
        <SocialRow episode={episode} />
      </div>
    </article>
  );
}

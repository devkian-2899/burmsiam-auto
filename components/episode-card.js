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

const POST_TYPE_BADGES = {
  reel: { Icon: IconPostReel, label: "FHD | Vertical" },
  reels: { Icon: IconPostReel, label: "FHD | Vertical" },
  vdeo: { Icon: IconPostVideo, label: "4K | 16:9" },
  video: { Icon: IconPostVideo, label: "4K | 16:9" },
  caro: { Icon: IconPostCarousel, label: "Photo | Article" },
  carousell: { Icon: IconPostCarousel, label: "Photo | Article" },
};

function PostTypeBadge({ postType }) {
  const code = String(postType || "").trim().toLowerCase();
  const badge = POST_TYPE_BADGES[code];
  if (!badge) return null;
  const { Icon, label } = badge;
  return (
    <div className="episode-post-type">
      <div className="episode-post-type-band" aria-label={label}>
        <Icon />
        <span>{label}</span>
      </div>
    </div>
  );
}

function hasUrl(value) {
  if (value == null) return false;
  return String(value).trim().length > 0;
}

function SocialRow({ episode }) {
  return (
    <div className="episode-social" aria-label="Where to watch">
      {SOCIALS.map(({ key, label, Icon }) => {
        const href = hasUrl(episode[key]) ? String(episode[key]).trim() : "";
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
          <span key={key} className="episode-social-link is-muted" role="img" aria-label={`${label} unavailable`}>
            <Icon />
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
        <PostTypeBadge postType={episode.postType} />
      </div>
      <div className="episode-heading">
        {episode.programAbbr ? (
          <p className="episode-program-abbr" aria-label={`Program ${episode.programAbbr}`}>
            {episode.programAbbr}
          </p>
        ) : null}
        <h3>{episode.title}</h3>
      </div>
      <div className="episode-body">
        {episode.description ? <p className="episode-copy">{episode.description}</p> : null}
      </div>
      <div className="episode-footer">
        <SocialRow episode={episode} />
      </div>
    </article>
  );
}

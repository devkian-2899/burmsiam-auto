import { seasonLabel } from "./catalog-rules.mjs";

function textOrNull(value) {
  if (value == null) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

export function groupEpisodes(rows) {
  const ordered = [...rows].sort((left, right) => Number(right.id || 0) - Number(left.id || 0));
  const groups = new Map();
  for (const row of ordered) {
    const key = `${row.season}\0${row.volume}`;
    if (!groups.has(key)) {
      groups.set(key, { season: row.season, volume: row.volume, episodes: [] });
    }
    const programAbbr = textOrNull(row.program_abbr);
    const programIconRaw = textOrNull(row.program_icon);
    const episode = {
      id: row.id,
      episode: row.episode,
      title: row.title || "Untitled",
      description: row.description || "",
      image: row.photo || "",
      postType: textOrNull(row.post_type),
      youtubeUrl: textOrNull(row.youtube_url),
      facebookUrl: textOrNull(row.facebook_url),
      instagramUrl: textOrNull(row.instagram_url),
      tiktokUrl: textOrNull(row.tiktok_url),
    };
    if (programAbbr) {
      episode.programAbbr = programAbbr;
      episode.programIcon = programIconRaw || `/images/programs/${programAbbr}.png`;
    }
    groups.get(key).episodes.push(episode);
  }
  return [...groups.values()];
}

export { seasonLabel };

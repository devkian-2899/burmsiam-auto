import { compareEpisodeNumbersDesc, compareSeasonVolume, seasonLabel } from "./catalog-rules.mjs";

function textOrNull(value) {
  if (value == null) return null;
  const text = String(value).trim();
  return text.length > 0 ? text : null;
}

export function groupEpisodes(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = `${row.season}\0${row.volume}`;
    if (!groups.has(key)) {
      groups.set(key, { season: row.season, volume: row.volume, episodes: [] });
    }
    const programAbbr = textOrNull(row.program_abbr);
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
    }
    groups.get(key).episodes.push(episode);
  }
  const list = [...groups.values()];
  for (const group of list) {
    group.episodes.sort((left, right) => compareEpisodeNumbersDesc(left.episode, right.episode));
  }
  list.sort((left, right) => compareSeasonVolume(left.season, left.volume, right.season, right.volume));
  return list;
}

export { seasonLabel };

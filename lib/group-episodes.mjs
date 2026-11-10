import { seasonLabel } from "./catalog-rules.mjs";

function textOrNull(value) {
  const text = String(value ?? "").trim();
  return text || null;
}

export function groupEpisodes(rows) {
  const ordered = [...rows].sort((left, right) => Number(right.id || 0) - Number(left.id || 0));
  const groups = new Map();
  for (const row of ordered) {
    const key = `${row.season}\0${row.volume}`;
    if (!groups.has(key)) {
      groups.set(key, { season: row.season, volume: row.volume, episodes: [] });
    }
    groups.get(key).episodes.push({
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
    });
  }
  return [...groups.values()];
}

export { seasonLabel };

import { seasonLabel } from "./catalog-rules.mjs";

function episodeCardLink(row) {
  for (const key of ["youtube_url", "facebook_url", "instagram_url", "tiktok_url"]) {
    const href = String(row[key] ?? "").trim();
    if (href) return href;
  }
  return "";
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
      link: episodeCardLink(row),
    });
  }
  return [...groups.values()];
}

export { seasonLabel };

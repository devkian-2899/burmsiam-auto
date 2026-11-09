import { seasonLabel } from "./catalog-rules.mjs";

export function groupEpisodes(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = `${row.season}\0${row.volume}`;
    if (!groups.has(key)) {
      groups.set(key, { season: row.season, volume: row.volume, episodes: [] });
    }
    groups.get(key).episodes.push({
      episode: row.episode,
      title: row.title || "Untitled",
      description: row.description || "",
      image: row.photo || "",
      link: row.link || "",
    });
  }
  return [...groups.values()].sort((a, b) => {
    const season = String(a.season).localeCompare(String(b.season), undefined, { numeric: true });
    if (season !== 0) return season;
    return String(a.volume).localeCompare(String(b.volume), undefined, { numeric: true });
  });
}

export { seasonLabel };

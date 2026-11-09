import { databaseConfigured } from "./db.mjs";
import { driveSources } from "./media.mjs";
import { episodesForAbbr, programMarks } from "./catalog-store.mjs";
import { groupEpisodes } from "./group-episodes.mjs";

function markFromRow(item) {
  return {
    name: item.abbr || item.name,
    href: `/${item.abbr}`,
    image: driveSources(item.icon || `/images/programs/${item.abbr}.png`, [720, 1080]),
  };
}

export async function publicProgramMarks() {
  if (!databaseConfigured()) return [];
  try {
    return (await programMarks()).map(markFromRow);
  } catch {
    return [];
  }
}

export async function publicProgram(abbr) {
  const code = String(abbr || "").trim();
  if (databaseConfigured()) {
    try {
      const found = await episodesForAbbr(code);
      if (found) {
        return {
          name: found.program.abbr || found.program.name || code.toUpperCase(),
          icon: found.program.icon || `/images/programs/${found.program.abbr}.png`,
          cover: found.program.cover || "",
          description: found.program.description || "",
          volumes: groupEpisodes(found.episodes),
        };
      }
    } catch {
      return null;
    }
  }
  return null;
}

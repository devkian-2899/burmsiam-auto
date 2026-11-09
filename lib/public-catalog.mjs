import { site } from "../content/site.js";
import { databaseConfigured } from "./db.mjs";
import { driveSources } from "./media.mjs";
import { episodesForAbbr, programMarks } from "./catalog-store.mjs";
import { groupEpisodes } from "./group-episodes.mjs";

function staticMarks() {
  return site.programs.map((item, index) => ({
    name: item.name || `Program ${index + 1}`,
    href: item.href,
    image: driveSources(item.image, [720, 1080]),
  }));
}

function markFromRow(item) {
  return {
    name: item.abbr || item.name,
    href: `/${item.abbr}`,
    image: driveSources(item.icon || `/images/programs/${item.abbr}.png`, [720, 1080]),
  };
}

export async function publicProgramMarks() {
  const fallback = staticMarks();
  if (!databaseConfigured()) return fallback;
  try {
    const rows = await programMarks();
    if (rows.length === 0) return fallback;
    const byAbbr = new Map(rows.map((row) => [row.abbr.toUpperCase(), row]));
    const used = new Set();
    const merged = fallback.map((item) => {
      const row = byAbbr.get(String(item.name).toUpperCase());
      if (!row) return item;
      used.add(row.abbr.toUpperCase());
      return markFromRow(row);
    });
    for (const row of rows) {
      if (!used.has(row.abbr.toUpperCase())) merged.push(markFromRow(row));
    }
    return merged;
  } catch {
    return fallback;
  }
}

function staticProgram(abbr) {
  const code = String(abbr || "").trim().toUpperCase();
  const program = site.programs.find((item) => item.name.toUpperCase() === code);
  if (!program) return null;
  return {
    name: program.name,
    icon: program.image,
    cover: program.cover || "",
    description: program.description || "",
    volumes: [],
  };
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
      return staticProgram(code);
    }
  }
  return staticProgram(code);
}

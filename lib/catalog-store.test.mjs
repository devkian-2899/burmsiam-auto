import assert from "node:assert/strict";
import test from "node:test";
import { databaseUrl } from "./database-url.mjs";
import {
  deleteProgram,
  episodesForAbbr,
  insertEpisode,
  insertProgram,
  insertSeason,
  listEpisodes,
  programEpisodeCount,
} from "./catalog-store.mjs";

const skip = Boolean(databaseUrl());

test("a program, season, and episode can be saved and read back", { skip }, async () => {
  const program = await insertProgram({
    name: "Burm Siam Street",
    abbr: "BSS",
    description: "Street episodes",
    cover: "/images/covers/cover-1.jpg",
    icon: "/images/programs/BSS.png",
  });
  const season = await insertSeason({ season: "1", volume: "2" });
  const episode = await insertEpisode({
    episode: "4",
    title: "Night market",
    description: "A short drive",
    link: "https://example.com/watch",
    photo: "/images/episodes/night.jpg",
    programId: program.id,
    seasonId: season.id,
  });
  assert.equal(episode.programAbbr, "BSS");
  assert.equal(episode.seasonLabel, "Season [1] Volume [2]");
  const listed = await listEpisodes();
  assert.equal(listed.some((row) => row.id === episode.id), true);
  const view = await episodesForAbbr("bss");
  assert.equal(view.program.abbr, "BSS");
  assert.equal(view.episodes[0].title, "Night market");
  assert.equal(await programEpisodeCount(program.id), 1);
  await assert.rejects(() => deleteProgram(program.id));
});

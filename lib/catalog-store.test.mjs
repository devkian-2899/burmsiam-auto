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
import { groupEpisodes } from "./group-episodes.mjs";

const skip = Boolean(databaseUrl());

test("a program, season, and episode can be saved and read back", { skip }, async () => {
  const program = await insertProgram({
    name: "Burm Siam Street",
    abbr: "BSS",
    description: "Street episodes",
    cover: "/images/covers/cover-1.jpg",
    icon: "/images/programs/BSS.png",
    sortingno: 4,
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
  assert.equal(program.sortingno, 4);
  assert.equal(episode.programAbbr, "BSS");
  assert.equal(episode.seasonLabel, "Season [1] Volume [2]");
  const listed = await listEpisodes();
  assert.equal(listed.some((row) => row.id === episode.id), true);
  const laterSeason = await insertSeason({ season: "2", volume: "1" });
  await insertEpisode({
    episode: "1",
    title: "Later row",
    description: "",
    link: "",
    photo: "/images/episodes/later.jpg",
    programId: program.id,
    seasonId: laterSeason.id,
  });
  const view = await episodesForAbbr("bss");
  assert.equal(view.program.abbr, "BSS");
  assert.deepEqual(groupEpisodes(view.episodes).map((group) => group.season), ["1", "2"]);
  assert.deepEqual(groupEpisodes(view.episodes)[0].episodes.map((row) => row.title), ["Night market"]);
  assert.equal(await programEpisodeCount(program.id), 2);
  await assert.rejects(() => deleteProgram(program.id));
});

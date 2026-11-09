import assert from "node:assert/strict";
import test from "node:test";
import { episodeInput, programInput, seasonInput, seasonLabel } from "./catalog-rules.mjs";
import { groupEpisodes } from "./group-episodes.mjs";

test("a program photo is stored and a link is refused", () => {
  const photo = "data:image/webp;base64,aaaa";
  const input = programInput({ abbr: "BSS", icon: photo, cover: photo });
  assert.equal(input.icon, photo);
  assert.equal(input.cover, photo);
  assert.match(programInput({ abbr: "BSS", cover: "https://drive.google.com/file/d/abc/view" }).error, /Background/);
});

test("a program abbreviation is stored in capitals", () => {
  const input = programInput({ abbr: "bss", name: "Burm Siam", description: "Stories" });
  assert.equal(input.abbr, "BSS");
  assert.equal(programInput({ abbr: "B S" }).error, "Use letters and numbers for the abbreviation.");
});

test("a season needs both parts and an episode needs both lists", () => {
  assert.equal(seasonInput({ season: "1", volume: "" }).error, "Enter the season and the volume.");
  assert.equal(seasonLabel("1", "2"), "Season [1] Volume [2]");
  assert.equal(episodeInput({ episode: "1", programId: "", seasonId: "4" }).error, "Choose a program.");
  const episode = episodeInput({ episode: "3", programId: "8", seasonId: "4", title: "Night run" });
  assert.equal(episode.programId, "8");
  assert.equal(episode.seasonId, "4");
});

test("episodes group under Season and Volume", () => {
  const groups = groupEpisodes([
    { season: "1", volume: "2", episode: "2", title: "Second", description: "", photo: "", link: "" },
    { season: "1", volume: "1", episode: "1", title: "First", description: "Note", photo: "/a.jpg", link: "https://example.com" },
  ]);
  assert.deepEqual(groups.map((group) => `${group.season}-${group.volume}`), ["1-1", "1-2"]);
  assert.equal(groups[0].episodes[0].image, "/a.jpg");
  assert.equal(groups[0].episodes[0].link, "https://example.com");
});

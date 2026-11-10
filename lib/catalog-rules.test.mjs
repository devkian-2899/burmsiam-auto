import assert from "node:assert/strict";
import test from "node:test";
import {
  episodeInput,
  episodePostTypeLabel,
  programInput,
  seasonInput,
  seasonLabel,
} from "./catalog-rules.mjs";
import { groupEpisodes } from "./group-episodes.mjs";

test("a program photo is stored and a link is refused", () => {
  const photo = "data:image/webp;base64,aaaa";
  const input = programInput({ abbr: "BSS", sortingno: "2", icon: photo, cover: photo });
  assert.equal(input.icon, photo);
  assert.equal(input.cover, photo);
  assert.match(programInput({ abbr: "BSS", sortingno: "2", cover: "https://drive.google.com/file/d/abc/view" }).error, /Background/);
});

test("a program abbreviation is stored in capitals", () => {
  const input = programInput({ abbr: "bss", sortingno: "1", name: "Burm Siam", description: "Stories" });
  assert.equal(input.abbr, "BSS");
  assert.equal(input.sortingno, 1);
  assert.equal(programInput({ abbr: "B S", sortingno: "1" }).error, "Use letters and numbers for the abbreviation.");
  assert.equal(programInput({ abbr: "BSS", sortingno: "" }).error, "Enter the sorting number.");
  assert.equal(programInput({ abbr: "BSS", sortingno: "1.5" }).error, "Sorting number must be a whole number.");
});

test("an episode cover is stored as a photo", () => {
  const photo = "data:image/webp;base64,bbbb";
  const input = episodeInput({ episodeMajor: "1", episodeMinor: "22", programId: "2", seasonId: "3", photo });
  assert.equal(input.episode, "[1.22]");
  assert.equal(input.photo, photo);
  assert.match(episodeInput({ episodeMajor: "1", episodeMinor: "22", programId: "2", seasonId: "3", photo: "https://drive.google.com/file/d/abc/view" }).error, /Cover/);
  assert.equal(episodeInput({ episodeMajor: "1", episodeMinor: "", programId: "2", seasonId: "3" }).error, "Enter both episode numbers.");
});

test("episode availability links are null when a platform is unchecked", () => {
  const withFacebook = episodeInput({
    episodeMajor: "1",
    episodeMinor: "1",
    programId: "2",
    seasonId: "3",
    facebookOn: true,
    facebookUrl: "https://facebook.com/watch/1",
    instagramOn: false,
    instagramUrl: "https://instagram.com/ignored",
    postType: "Reels",
  });
  assert.equal(withFacebook.facebookUrl, "https://facebook.com/watch/1");
  assert.equal(withFacebook.instagramUrl, null);
  assert.equal(withFacebook.postType, "reel");
  const cleared = episodeInput({
    episodeMajor: "1",
    episodeMinor: "1",
    programId: "2",
    seasonId: "3",
    youtubeOn: true,
    youtubeUrl: "",
  });
  assert.equal(cleared.error, "Enter the YouTube link.");
  assert.equal(episodeInput({ episodeMajor: "1", episodeMinor: "1", programId: "2", seasonId: "3", postType: "Video" }).postType, "vdeo");
  assert.equal(episodeInput({ episodeMajor: "1", episodeMinor: "1", programId: "2", seasonId: "3", postType: "Carousell" }).postType, "caro");
  assert.equal(episodePostTypeLabel("reel"), "Reels");
  assert.equal(episodePostTypeLabel("vdeo"), "Video");
});

test("a season needs both parts and an episode needs both lists", () => {
  assert.equal(seasonInput({ season: "1", volume: "" }).error, "Enter the season and the volume.");
  assert.equal(seasonLabel("1", "2"), "Season [1] Volume [2]");
  assert.equal(seasonLabel("0", "0"), "Pre-season AI Episodes");
  assert.equal(episodeInput({ episodeMajor: "1", episodeMinor: "1", programId: "", seasonId: "4" }).error, "Choose a program.");
  const episode = episodeInput({ episodeMajor: "3", episodeMinor: "1", programId: "8", seasonId: "4", title: "Night run" });
  assert.equal(episode.programId, "8");
  assert.equal(episode.seasonId, "4");
});

test("episodes group newest registration first", () => {
  const groups = groupEpisodes([
    { id: 1, season: "1", volume: "1", episode: "1", title: "Older", description: "", photo: "" },
    { id: 3, season: "1", volume: "2", episode: "1", title: "Newest season", description: "", photo: "/new.jpg", youtube_url: "https://example.com/new" },
    { id: 2, season: "1", volume: "1", episode: "2", title: "Newer", description: "Note", photo: "/a.jpg", facebook_url: "https://example.com" },
  ]);
  assert.deepEqual(groups.map((group) => `${group.season}-${group.volume}`), ["1-2", "1-1"]);
  assert.deepEqual(groups[1].episodes.map((episode) => episode.title), ["Newer", "Older"]);
  assert.equal(groups[0].episodes[0].image, "/new.jpg");
  assert.equal(groups[0].episodes[0].youtubeUrl, "https://example.com/new");
  assert.equal(groups[1].episodes[0].facebookUrl, "https://example.com");
});

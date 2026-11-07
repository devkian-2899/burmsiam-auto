import assert from "node:assert/strict";
import test from "node:test";
import { driveId, driveSources, youtubeId } from "./media.mjs";

test("reads a Google Drive file id from the public share link", () => {
  assert.equal(
    driveId("https://drive.google.com/file/d/abc_DEF-1234567/view?usp=sharing"),
    "abc_DEF-1234567",
  );
  assert.equal(driveId("https://drive.google.com/open?id=abc_DEF-1234567"), "abc_DEF-1234567");
  assert.equal(driveId("https://drive.google.com/uc?export=view&id=abc_DEF-1234567"), "abc_DEF-1234567");
  assert.equal(driveId("abc_DEF-1234567"), "abc_DEF-1234567");
});

test("builds sized image addresses for a public Drive file", () => {
  const sources = driveSources("https://drive.google.com/file/d/abc_DEF-1234567/view", [3840, 1280]);
  assert.equal(sources.src, "https://lh3.googleusercontent.com/d/abc_DEF-1234567=w3840");
  assert.match(sources.srcSet, /1280w/);
  assert.match(sources.srcSet, /3840w/);
});

test("leaves a normal image address unchanged", () => {
  const sources = driveSources("https://example.com/photo.webp", [1080]);
  assert.equal(sources.src, "https://example.com/photo.webp");
  assert.equal(sources.srcSet, "");
});

test("reads a YouTube id from a watch link, a short link, or a bare id", () => {
  assert.equal(youtubeId("https://www.youtube.com/watch?v=abcdefghijk"), "abcdefghijk");
  assert.equal(youtubeId("https://youtu.be/abcdefghijk"), "abcdefghijk");
  assert.equal(youtubeId("https://www.youtube.com/shorts/abcdefghijk"), "abcdefghijk");
  assert.equal(youtubeId("abcdefghijk"), "abcdefghijk");
  assert.equal(youtubeId(""), "");
});

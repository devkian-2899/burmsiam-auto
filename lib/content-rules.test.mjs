import assert from "node:assert/strict";
import test from "node:test";
import { slideInput, youtubeInput } from "./content-rules.mjs";

test("a YouTube link is kept and a plain web page is refused", () => {
  assert.equal(youtubeInput({ link: "https://youtu.be/abcdefghijk" }).link, "https://youtu.be/abcdefghijk");
  assert.equal(youtubeInput({ link: "https://example.com/watch" }).error, "Enter a YouTube link.");
});

test("a slide photo is stored and a Drive link is refused", () => {
  const photo = "data:image/webp;base64,cccc";
  const input = slideInput({ photo, link: "https://example.com/story" });
  assert.equal(input.photo, photo);
  assert.equal(input.link, "https://example.com/story");
  assert.match(slideInput({ photo: "https://drive.google.com/file/d/abc/view", link: "" }).error, /Photo/);
  assert.equal(slideInput({ photo: "", link: "" }).error, "Choose a photo.");
});

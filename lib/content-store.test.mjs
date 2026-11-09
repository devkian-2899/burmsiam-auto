import assert from "node:assert/strict";
import test from "node:test";
import { databaseUrl } from "./database-url.mjs";
import {
  clearYoutube,
  deleteSlide,
  getYoutube,
  insertSlide,
  listPublicSlides,
  listSlides,
  saveYoutube,
} from "./content-store.mjs";

const skip = Boolean(databaseUrl());

test("a YouTube link and a slide can be saved and read back", { skip }, async () => {
  const saved = await saveYoutube("https://youtu.be/abcdefghijk");
  assert.equal(saved.link, "https://youtu.be/abcdefghijk");
  assert.equal((await getYoutube()).link, "https://youtu.be/abcdefghijk");
  await clearYoutube();
  assert.equal((await getYoutube()).link, "");

  const older = await insertSlide({ photo: "/images/covers/cover-1.jpg", link: "https://example.com/older" });
  const newer = await insertSlide({ photo: "/images/covers/cover-2.jpg", link: "" });
  const listed = await listSlides();
  assert.equal(listed[0].id, newer.id);
  assert.equal(listed[0].hasPhoto, true);
  assert.equal((await listPublicSlides())[0].id, newer.id);
  assert.equal(await deleteSlide(older.id), true);
});

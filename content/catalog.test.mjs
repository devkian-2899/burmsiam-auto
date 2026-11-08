import assert from "node:assert/strict";
import test from "node:test";
import { catalog } from "./catalog.js";
import { site } from "./site.js";

test("every program can hold seasons, volumes, and episodes", () => {
  for (const program of site.programs) {
    const volumes = catalog[program.name];
    assert.ok(volumes?.length, program.name);
    for (const volume of volumes) {
      assert.equal(typeof volume.season, "number");
      assert.equal(typeof volume.volume, "number");
      assert.ok(volume.episodes.length);
      for (const episode of volume.episodes) {
        assert.equal(typeof episode.episode, "number");
        assert.equal(typeof episode.title, "string");
        assert.equal(typeof episode.image, "string");
      }
    }
  }
});

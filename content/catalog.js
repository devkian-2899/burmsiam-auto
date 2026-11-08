import { site } from "./site.js";

// One program is a list of volumes. Each volume belongs to a season.
// Each episode belongs to that volume, has its own number, a title, and a
// 1080p picture in public/images/episodes. Leave image as "" until the file
// is there, then set it to "/images/episodes/your-file.png".

function episodes(count) {
  return Array.from({ length: count }, (_, index) => ({
    episode: index + 1,
    title: "Title Here",
    image: "",
  }));
}

function starter() {
  return [
    { season: 1, volume: 1, episodes: episodes(4) },
    { season: 1, volume: 2, episodes: episodes(4) },
    { season: 1, volume: 3, episodes: episodes(2) },
    { season: 2, volume: 1, episodes: episodes(2) },
  ];
}

export const catalog = Object.fromEntries(site.programs.map((program) => [program.name, starter()]));

export function volumesFor(name) {
  return catalog[name] || [];
}

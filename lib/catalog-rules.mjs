function text(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

export function seasonLabel(season, volume) {
  return `Season [${season}] Volume [${volume}]`;
}

export function programInput(body) {
  const abbr = text(body.abbr, 20).toUpperCase();
  if (!abbr) return { error: "Enter the abbreviation." };
  if (!/^[A-Z0-9]+$/.test(abbr)) return { error: "Use letters and numbers for the abbreviation." };
  return {
    name: text(body.name, 160),
    abbr,
    description: text(body.description, 4000),
    cover: text(body.cover, 2000),
    icon: text(body.icon, 2000),
  };
}

export function seasonInput(body) {
  const season = text(body.season, 40);
  const volume = text(body.volume, 40);
  if (!season || !volume) return { error: "Enter the season and the volume." };
  return { season, volume };
}

export function episodeInput(body) {
  const programId = text(body.programId, 30);
  const seasonId = text(body.seasonId, 30);
  const episode = text(body.episode, 40);
  if (!episode) return { error: "Enter the episode number." };
  if (!/^\d+$/.test(programId)) return { error: "Choose a program." };
  if (!/^\d+$/.test(seasonId)) return { error: "Choose a season." };
  return {
    episode,
    title: text(body.title, 240),
    description: text(body.description, 4000),
    link: text(body.link, 2000),
    photo: text(body.photo, 2000),
    programId,
    seasonId,
  };
}

export function recordId(value) {
  const id = text(value, 30);
  return /^\d+$/.test(id) ? id : "";
}

const IMAGE_MAX = 2_500_000;

function text(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function sortingNumber(value) {
  const raw = String(value ?? "").trim();
  if (!raw) return { error: "Enter the sorting number." };
  if (!/^-?\d+$/.test(raw)) return { error: "Sorting number must be a whole number." };
  const number = Number(raw);
  if (!Number.isSafeInteger(number) || number < -2147483648 || number > 2147483647) {
    return { error: "Sorting number must be a whole number." };
  }
  return number;
}

function storedImage(value, label) {
  const image = String(value ?? "").trim();
  if (!image) return "";
  if (image.startsWith("data:image/")) {
    if (image.length > IMAGE_MAX) return { error: `${label} is too large. Choose a smaller photo.` };
    if (!/^data:image\/(png|jpeg|jpg|webp);base64,[a-z0-9+/=\s]+$/i.test(image)) {
      return { error: `${label} must be a photo.` };
    }
    return image;
  }
  if (image.startsWith("/") && image.length <= 2000) return image;
  return { error: `${label} must be a photo.` };
}

export function seasonLabel(season, volume) {
  return `Season [${season}] Volume [${volume}]`;
}

export function programInput(body) {
  const abbr = text(body.abbr, 20).toUpperCase();
  if (!abbr) return { error: "Enter the abbreviation." };
  if (!/^[A-Z0-9]+$/.test(abbr)) return { error: "Use letters and numbers for the abbreviation." };
  const sortingno = sortingNumber(body.sortingno);
  if (sortingno?.error) return sortingno;
  const cover = storedImage(body.cover, "Background");
  const icon = storedImage(body.icon, "Icon");
  if (cover?.error) return cover;
  if (icon?.error) return icon;
  return {
    name: text(body.name, 160),
    abbr,
    sortingno,
    description: text(body.description, 4000),
    cover,
    icon,
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
  const photo = storedImage(body.photo, "Cover");
  if (photo?.error) return photo;
  return {
    episode,
    title: text(body.title, 240),
    description: text(body.description, 4000),
    link: text(body.link, 2000),
    photo,
    programId,
    seasonId,
  };
}

export function recordId(value) {
  const id = text(value, 30);
  return /^\d+$/.test(id) ? id : "";
}

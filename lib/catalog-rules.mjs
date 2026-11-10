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

export function storedImage(value, label) {
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

export const EPISODE_POST_TYPE_OPTIONS = [
  { label: "Reels", code: "reel" },
  { label: "Video", code: "vdeo" },
  { label: "Carousell", code: "caro" },
];

const EPISODE_POST_TYPE_BY_LABEL = Object.fromEntries(
  EPISODE_POST_TYPE_OPTIONS.map((item) => [item.label, item.code]),
);

export function episodePostTypeLabel(stored) {
  const value = String(stored || "").trim();
  if (!value) return "";
  const match = EPISODE_POST_TYPE_OPTIONS.find((item) => item.code === value || item.label === value);
  return match ? match.label : "";
}

function webLink(value, label) {
  const link = text(value, 2000);
  if (!link) return "";
  try {
    const url = new URL(link);
    if (url.protocol !== "https:" && url.protocol !== "http:") {
      return { error: `${label} must start with http:// or https://.` };
    }
    return link;
  } catch {
    return { error: `${label} must start with http:// or https://.` };
  }
}

function checked(body, name) {
  return body[name] === true || body[name] === "true" || body[name] === 1 || body[name] === "1";
}

function platformLink(body, flag, field, label) {
  if (!checked(body, flag)) return null;
  const link = webLink(body[field], label);
  if (link?.error) return link;
  if (!link) return { error: `Enter the ${label} link.` };
  return link;
}

function postType(body) {
  const value = text(body.postType, 40);
  if (!value) return null;
  const code = EPISODE_POST_TYPE_BY_LABEL[value] || EPISODE_POST_TYPE_OPTIONS.find((item) => item.code === value)?.code;
  if (!code) return { error: "Choose a post type." };
  return code;
}

function episodeCode(major, minor) {
  const left = String(major ?? "").trim();
  const right = String(minor ?? "").trim();
  if (!/^\d+$/.test(left) || !/^\d+$/.test(right) || left.length > 6 || right.length > 6) {
    return { error: "Enter both episode numbers." };
  }
  return `[${left}.${right}]`;
}

export function episodeInput(body) {
  const programId = text(body.programId, 30);
  const seasonId = text(body.seasonId, 30);
  const episode = episodeCode(body.episodeMajor, body.episodeMinor);
  if (episode?.error) return episode;
  if (!/^\d+$/.test(programId)) return { error: "Choose a program." };
  if (!/^\d+$/.test(seasonId)) return { error: "Choose a season." };
  const photo = storedImage(body.photo, "Cover");
  if (photo?.error) return photo;
  const facebookUrl = platformLink(body, "facebookOn", "facebookUrl", "Facebook");
  if (facebookUrl?.error) return facebookUrl;
  const instagramUrl = platformLink(body, "instagramOn", "instagramUrl", "Instagram");
  if (instagramUrl?.error) return instagramUrl;
  const youtubeUrl = platformLink(body, "youtubeOn", "youtubeUrl", "YouTube");
  if (youtubeUrl?.error) return youtubeUrl;
  const tiktokUrl = platformLink(body, "tiktokOn", "tiktokUrl", "TikTok");
  if (tiktokUrl?.error) return tiktokUrl;
  const episodePostType = postType(body);
  if (episodePostType?.error) return episodePostType;
  return {
    episode,
    title: text(body.title, 240),
    description: text(body.description, 4000),
    photo,
    programId,
    seasonId,
    facebookUrl,
    instagramUrl,
    youtubeUrl,
    tiktokUrl,
    postType: episodePostType,
  };
}

export function recordId(value) {
  const id = text(value, 30);
  return /^\d+$/.test(id) ? id : "";
}

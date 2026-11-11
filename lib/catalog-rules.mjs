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

export function parseEpisodeNumber(code) {
  const value = String(code ?? "").trim();
  const bracketed = value.match(/^\[(\d+)\.(\d+)\]$/);
  if (bracketed) {
    return { major: Number(bracketed[1]), minor: Number(bracketed[2]), raw: value };
  }
  const plain = value.match(/^(\d+)$/);
  if (plain) {
    return { major: 0, minor: Number(plain[1]), raw: value };
  }
  return { major: 0, minor: 0, raw: value };
}

export function compareEpisodeNumbers(left, right) {
  const a = parseEpisodeNumber(left);
  const b = parseEpisodeNumber(right);
  if (a.major !== b.major) return a.major - b.major;
  if (a.minor !== b.minor) return a.minor - b.minor;
  return a.raw.localeCompare(b.raw, undefined, { numeric: true });
}

/** Highest episode number first (e.g. [0.8] before [0.1]). */
export function compareEpisodeNumbersDesc(left, right) {
  return compareEpisodeNumbers(right, left);
}

export function compareSeasonVolume(leftSeason, leftVolume, rightSeason, rightVolume) {
  const sa = Number(String(leftSeason ?? "").trim()) || 0;
  const sb = Number(String(rightSeason ?? "").trim()) || 0;
  if (sa !== sb) return sa - sb;
  const va = Number(String(leftVolume ?? "").trim()) || 0;
  const vb = Number(String(rightVolume ?? "").trim()) || 0;
  return va - vb;
}

export function isPreseasonOriginalVolume(season, volume) {
  return String(season ?? "").trim() === "0" && String(volume ?? "").trim() === "2";
}

export function isPreseasonAiVolume(season, volume) {
  const seasonText = String(season ?? "").trim();
  const volumeText = String(volume ?? "").trim();
  return seasonText === "0" && (volumeText === "1" || volumeText === "0");
}

export function hasSeasonOneVolumeOneEpisodes(groups) {
  return groups.some(
    (group) =>
      String(group.season ?? "").trim() === "1" &&
      String(group.volume ?? "").trim() === "1" &&
      group.episodes?.length > 0,
  );
}

/** Catalog volume order: Original pre-season first, AI last, until season 1 volume 1 has episodes. */
export function compareCatalogVolumeGroups(left, right, seasonOneVolumeOneLive) {
  if (!seasonOneVolumeOneLive) {
    const rank = (group) => {
      if (isPreseasonOriginalVolume(group.season, group.volume)) return 0;
      if (isPreseasonAiVolume(group.season, group.volume)) return 2;
      return 1;
    };
    const leftRank = rank(left);
    const rightRank = rank(right);
    if (leftRank !== rightRank) return leftRank - rightRank;
  }
  return compareSeasonVolume(left.season, left.volume, right.season, right.volume);
}

export function seasonLabel(season, volume) {
  const seasonText = String(season ?? "").trim();
  const volumeText = String(volume ?? "").trim();
  if (seasonText === "0" && volumeText === "2") {
    return "Pre-season Original Episode";
  }
  if (seasonText === "0" && (volumeText === "1" || volumeText === "0")) {
    return "Pre-season AI Episode";
  }
  return `Season [${seasonText}] Volume [${volumeText}]`;
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

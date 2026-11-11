import { storedImage } from "./catalog-rules.mjs";
import { youtubeId } from "./media.mjs";

function text(value, max) {
  return String(value ?? "").trim().slice(0, max);
}

function webLink(value, label) {
  const link = text(value, 2000);
  if (!link) return "";
  try {
    const url = new URL(link);
    if (url.protocol !== "https:" && url.protocol !== "http:") return { error: `${label} must start with http:// or https://.` };
    return link;
  } catch {
    return { error: `${label} must start with http:// or https://.` };
  }
}

export function youtubeInput(body) {
  const link = text(body.link ?? body.youtube, 2000);
  if (!link || !youtubeId(link)) {
    return { error: "Enter a YouTube embed, watch, or youtu.be link." };
  }
  return { link };
}

export function slideInput(body) {
  const photo = storedImage(body.photo, "Photo");
  if (photo?.error) return photo;
  if (!photo) return { error: "Choose a photo." };
  const link = webLink(body.link, "Link");
  if (link?.error) return link;
  return { photo, link };
}

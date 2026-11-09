import { connection } from "next/server";
import { site } from "../content/site.js";
import { getYoutube, listPublicSlides } from "./content-store.mjs";
import { databaseConfigured } from "./db.mjs";
import { driveSources } from "./media.mjs";

export async function publicYoutube() {
  if (!databaseConfigured()) return site.youtube;
  try {
    const row = await getYoutube();
    if (!row) return site.youtube;
    return row.link || "";
  } catch {
    return site.youtube;
  }
}

export async function publicSlides() {
  await connection();
  if (!databaseConfigured()) return [];
  try {
    const rows = await listPublicSlides();
    return rows.map((row) => ({
      id: row.id,
      title: "Latest story",
      href: String(row.link || "").trim(),
      image: driveSources(row.photo, [1280, 1920]),
    }));
  } catch {
    return [];
  }
}

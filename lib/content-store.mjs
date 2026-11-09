import { sql } from "./db.mjs";

function id(value) {
  return value == null ? "" : String(value);
}

export async function getYoutube() {
  const rows = await sql("select id, youtube from visual order by id limit 1");
  if (!rows[0]) return null;
  return { id: id(rows[0].id), link: rows[0].youtube || "" };
}

export async function saveYoutube(link) {
  const current = await getYoutube();
  if (!current) {
    const rows = await sql("insert into visual (youtube) values ($1) returning id, youtube", [link]);
    return { id: id(rows[0].id), link: rows[0].youtube || "" };
  }
  const rows = await sql(
    "update visual set youtube = $2 where id = $1 returning id, youtube",
    [current.id, link],
  );
  return { id: id(rows[0].id), link: rows[0].youtube || "" };
}

export async function clearYoutube() {
  const current = await getYoutube();
  if (!current) return false;
  await sql("update visual set youtube = '' where id = $1", [current.id]);
  return true;
}

export async function listSlides() {
  const rows = await sql(
    "select id, link, (photo <> '') as has_photo from latest order by id desc",
  );
  return rows.map((row) => ({
    id: id(row.id),
    link: row.link || "",
    hasPhoto: Boolean(row.has_photo),
  }));
}

export async function getSlide(slideId) {
  const rows = await sql("select id, photo, link from latest where id = $1", [slideId]);
  if (!rows[0]) return null;
  return { id: id(rows[0].id), photo: rows[0].photo || "", link: rows[0].link || "" };
}

export async function insertSlide(input) {
  const rows = await sql(
    "insert into latest (photo, link) values ($1, $2) returning id",
    [input.photo, input.link],
  );
  return getSlide(rows[0].id);
}

export async function updateSlide(slideId, input) {
  const rows = await sql(
    "update latest set photo = $2, link = $3 where id = $1 returning id",
    [slideId, input.photo, input.link],
  );
  return rows[0] ? getSlide(rows[0].id) : null;
}

export async function deleteSlide(slideId) {
  const rows = await sql("delete from latest where id = $1 returning id", [slideId]);
  return Boolean(rows[0]);
}

export async function listPublicSlides() {
  const rows = await sql(
    "select id, photo, link from latest where photo <> '' order by id desc",
  );
  return rows.map((row) => ({
    id: id(row.id),
    photo: row.photo || "",
    link: row.link || "",
  }));
}

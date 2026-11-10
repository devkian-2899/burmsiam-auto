import { sql } from "./db.mjs";
import { seasonLabel } from "./catalog-rules.mjs";

function id(value) {
  return value == null ? "" : String(value);
}

export function publicProgram(row) {
  return {
    id: id(row.id),
    name: row.name || "",
    abbr: row.abbr || "",
    description: row.description || "",
    cover: row.cover || "",
    icon: row.icon || "",
    sortingno: Number(row.sortingno || 0),
  };
}

export function publicSeason(row) {
  return {
    id: id(row.id),
    season: row.season || "",
    volume: row.volume || "",
    label: seasonLabel(row.season || "", row.volume || ""),
  };
}

function nullableText(value) {
  if (value == null || value === "") return null;
  return String(value);
}

export function publicEpisode(row) {
  return {
    id: id(row.id),
    episode: row.episode || "",
    title: row.title || "",
    description: row.description || "",
    photo: row.photo || "",
    programId: id(row.program_id),
    seasonId: id(row.season_id),
    programAbbr: row.program_abbr || "",
    season: row.season || "",
    volume: row.volume || "",
    seasonLabel: seasonLabel(row.season || "", row.volume || ""),
    facebookUrl: nullableText(row.facebook_url),
    instagramUrl: nullableText(row.instagram_url),
    youtubeUrl: nullableText(row.youtube_url),
    tiktokUrl: nullableText(row.tiktok_url),
    postType: nullableText(row.post_type),
  };
}

export async function listPrograms() {
  const rows = await sql(
    "select id, name, abbr, description, sortingno from programs order by sortingno asc, id asc",
  );
  return rows.map(publicProgram);
}

export async function getProgram(programId) {
  const rows = await sql(
    "select id, name, abbr, description, cover, icon, sortingno from programs where id = $1",
    [programId],
  );
  return rows[0] ? publicProgram(rows[0]) : null;
}

export async function insertProgram(input) {
  const rows = await sql(
    `insert into programs (name, abbr, description, cover, icon, sortingno)
     values ($1, $2, $3, $4, $5, $6)
     returning id, name, abbr, description, cover, icon, sortingno`,
    [input.name, input.abbr, input.description, input.cover, input.icon, input.sortingno],
  );
  return publicProgram(rows[0]);
}

export async function updateProgram(programId, input) {
  const rows = await sql(
    `update programs
     set name = $2, abbr = $3, description = $4, cover = $5, icon = $6, sortingno = $7
     where id = $1
     returning id, name, abbr, description, cover, icon, sortingno`,
    [programId, input.name, input.abbr, input.description, input.cover, input.icon, input.sortingno],
  );
  return rows[0] ? publicProgram(rows[0]) : null;
}

export async function programEpisodeCount(programId) {
  const rows = await sql("select count(*)::int as count from episodes where program_id = $1", [programId]);
  return Number(rows[0]?.count || 0);
}

export async function deleteProgram(programId) {
  const rows = await sql("delete from programs where id = $1 returning id", [programId]);
  return Boolean(rows[0]);
}

export async function listSeasons() {
  const rows = await sql("select id, season, volume from seasons order by season, volume, id");
  return rows.map(publicSeason);
}

export async function getSeason(seasonId) {
  const rows = await sql("select id, season, volume from seasons where id = $1", [seasonId]);
  return rows[0] ? publicSeason(rows[0]) : null;
}

export async function insertSeason(input) {
  const rows = await sql(
    `insert into seasons (season, volume) values ($1, $2) returning id, season, volume`,
    [input.season, input.volume],
  );
  return publicSeason(rows[0]);
}

export async function updateSeason(seasonId, input) {
  const rows = await sql(
    `update seasons set season = $2, volume = $3 where id = $1 returning id, season, volume`,
    [seasonId, input.season, input.volume],
  );
  return rows[0] ? publicSeason(rows[0]) : null;
}

export async function seasonEpisodeCount(seasonId) {
  const rows = await sql("select count(*)::int as count from episodes where season_id = $1", [seasonId]);
  return Number(rows[0]?.count || 0);
}

export async function deleteSeason(seasonId) {
  const rows = await sql("delete from seasons where id = $1 returning id", [seasonId]);
  return Boolean(rows[0]);
}

const episodeSelect = `
  select e.id, e.episode, e.title, e.description, e.photo, e.program_id, e.season_id,
         e.facebook_url, e.instagram_url, e.youtube_url, e.tiktok_url, e.post_type,
         p.abbr as program_abbr, s.season, s.volume
  from episodes e
  join programs p on p.id = e.program_id
  join seasons s on s.id = e.season_id
`;

export async function listEpisodes() {
  const rows = await sql(
    `select e.id, e.episode, e.title, e.description, '' as photo, e.program_id, e.season_id,
            e.facebook_url, e.instagram_url, e.youtube_url, e.tiktok_url, e.post_type,
            p.abbr as program_abbr, s.season, s.volume
     from episodes e
     join programs p on p.id = e.program_id
     join seasons s on s.id = e.season_id
     order by p.abbr, s.season, s.volume, e.episode, e.id`,
  );
  return rows.map(publicEpisode);
}

export async function getEpisode(episodeId) {
  const rows = await sql(`${episodeSelect} where e.id = $1`, [episodeId]);
  return rows[0] ? publicEpisode(rows[0]) : null;
}

export async function insertEpisode(input) {
  const rows = await sql(
    `insert into episodes (
       episode, title, description, photo, program_id, season_id,
       facebook_url, instagram_url, youtube_url, tiktok_url, post_type
     )
     values ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
     returning id`,
    [
      input.episode,
      input.title,
      input.description,
      input.photo,
      input.programId,
      input.seasonId,
      input.facebookUrl,
      input.instagramUrl,
      input.youtubeUrl,
      input.tiktokUrl,
      input.postType,
    ],
  );
  return getEpisode(rows[0].id);
}

export async function updateEpisode(episodeId, input) {
  const rows = await sql(
    `update episodes
     set episode = $2, title = $3, description = $4, photo = $5, program_id = $6, season_id = $7,
         facebook_url = $8, instagram_url = $9, youtube_url = $10, tiktok_url = $11, post_type = $12
     where id = $1
     returning id`,
    [
      episodeId,
      input.episode,
      input.title,
      input.description,
      input.photo,
      input.programId,
      input.seasonId,
      input.facebookUrl,
      input.instagramUrl,
      input.youtubeUrl,
      input.tiktokUrl,
      input.postType,
    ],
  );
  return rows[0] ? getEpisode(rows[0].id) : null;
}

export async function deleteEpisode(episodeId) {
  const rows = await sql("delete from episodes where id = $1 returning id", [episodeId]);
  return Boolean(rows[0]);
}

export async function episodesForAbbr(abbr) {
  const programs = await sql(
    "select id, name, abbr, description, cover, icon from programs where upper(abbr) = upper($1) limit 1",
    [abbr],
  );
  if (!programs[0]) return null;
  const rows = await sql(
    `select e.id, e.episode, e.title, e.description, e.photo,
            e.facebook_url, e.instagram_url, e.youtube_url, e.tiktok_url, e.post_type,
            s.season, s.volume
     from episodes e
     join seasons s on s.id = e.season_id
     where e.program_id = $1
     order by e.id desc`,
    [programs[0].id],
  );
  return { program: publicProgram(programs[0]), episodes: rows };
}

export async function programMarks() {
  const rows = await sql(
    "select abbr, name, icon from programs where abbr <> '' order by sortingno asc, id asc",
  );
  return rows.map((row) => ({
    abbr: row.abbr,
    name: row.name || row.abbr,
    icon: row.icon || "",
  }));
}

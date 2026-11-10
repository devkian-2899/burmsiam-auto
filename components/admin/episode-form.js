"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { EPISODE_POST_TYPE_OPTIONS, episodePostTypeLabel } from "../../lib/catalog-rules.mjs";
import { readPhoto } from "./read-photo";

const PLATFORMS = [
  { on: "facebookOn", url: "facebookUrl", label: "Facebook", banner: "Add Facebook Link..." },
  { on: "instagramOn", url: "instagramUrl", label: "Instagram", banner: "Add Instagram Link..." },
  { on: "youtubeOn", url: "youtubeUrl", label: "YouTube", banner: "Add YouTube Link..." },
  { on: "tiktokOn", url: "tiktokUrl", label: "TikTok", banner: "TikTok Link..." },
];

const empty = {
  episodeMajor: "",
  episodeMinor: "",
  title: "",
  description: "",
  photo: "",
  programId: "",
  seasonId: "",
  facebookOn: false,
  facebookUrl: "",
  instagramOn: false,
  instagramUrl: "",
  youtubeOn: false,
  youtubeUrl: "",
  tiktokOn: false,
  tiktokUrl: "",
  postType: "",
};

function fromRecord(record) {
  const stored = String(record?.episode || "");
  const match = stored.match(/^\[(\d+)\.(\d+)\]$/);
  const plain = /^\d+$/.test(stored) ? stored : "";
  return {
    ...empty,
    ...record,
    episodeMajor: match?.[1] || plain,
    episodeMinor: match?.[2] || "",
    facebookOn: Boolean(record?.facebookUrl),
    facebookUrl: record?.facebookUrl || "",
    instagramOn: Boolean(record?.instagramUrl),
    instagramUrl: record?.instagramUrl || "",
    youtubeOn: Boolean(record?.youtubeUrl),
    youtubeUrl: record?.youtubeUrl || "",
    tiktokOn: Boolean(record?.tiktokUrl),
    tiktokUrl: record?.tiktokUrl || "",
    postType: episodePostTypeLabel(record?.postType),
  };
}

export function EpisodeForm({ mode, record }) {
  const router = useRouter();
  const [values, setValues] = useState(record ? fromRecord(record) : empty);
  const [programs, setPrograms] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [lists, setLists] = useState("loading");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [reading, setReading] = useState(0);
  const [fileKey, setFileKey] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/admin/programs").then((response) => response.json()),
      fetch("/api/admin/seasons").then((response) => response.json()),
    ]).then(([programBody, seasonBody]) => {
      if (!active) return;
      setPrograms(programBody.programs || []);
      setSeasons(seasonBody.seasons || []);
      setLists("ready");
    }).catch(() => {
      if (!active) return;
      setLists("error");
    });
    return () => {
      active = false;
    };
  }, []);

  function setField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  function setPlatform(event) {
    const { name, checked } = event.target;
    const platform = PLATFORMS.find((item) => item.on === name);
    setValues((current) => ({
      ...current,
      [name]: checked,
      ...(platform && !checked ? { [platform.url]: "" } : null),
    }));
  }

  function setDigits(name, event) {
    const value = event.target.value.replace(/\D/g, "").slice(0, 6);
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function setCover(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setNotice("");
    setReading((count) => count + 1);
    try {
      const photo = await readPhoto(file, 1920);
      setValues((current) => ({ ...current, photo }));
    } catch (error) {
      setNotice(error.message || "That photo could not be read.");
    } finally {
      setReading((count) => count - 1);
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    setNotice("");
    setPending(true);
    const response = await fetch(mode === "edit" ? `/api/admin/episodes/${record.id}` : "/api/admin/episodes", {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setNotice(body.error || "The episode was not saved.");
      return;
    }
    if (mode === "edit") {
      router.push("/admin/episodes/add");
      router.refresh();
      return;
    }
    setValues(empty);
    setFileKey((key) => key + 1);
    setNotice("Saved. You can add another.");
  }

  async function remove() {
    const response = await fetch(`/api/admin/episodes/${record.id}`, { method: "DELETE" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setNotice(body.error || "The episode was not deleted.");
      setConfirmDelete(false);
      return;
    }
    router.push("/admin/episodes/add");
    router.refresh();
  }

  return (
    <form className="admin-card" onSubmit={onSubmit}>
      <h1>{mode === "edit" ? "Edit episode" : "New episode"}</h1>
      <p className="admin-lead">The cover is saved with the episode. Program and season come from the database.</p>
      {lists === "loading" ? <p className="admin-status">Loading lists…</p> : null}
      {lists === "error" ? <p className="admin-status">The program and season lists could not be loaded.</p> : null}
      {lists === "ready" && programs.length === 0 ? <p className="admin-status">Add a program before saving an episode.</p> : null}
      {lists === "ready" && seasons.length === 0 ? <p className="admin-status">Add a season before saving an episode.</p> : null}
      <label>
        <span>Program</span>
        <select name="programId" value={values.programId} onChange={setField} required>
          <option value="">Select a program</option>
          {programs.map((program) => (
            <option key={program.id} value={program.id}>{program.abbr}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Season</span>
        <select name="seasonId" value={values.seasonId} onChange={setField} required>
          <option value="">Select a season</option>
          {seasons.map((season) => (
            <option key={season.id} value={season.id}>{season.label}</option>
          ))}
        </select>
      </label>
      <label>
        <span>Title</span>
        <input name="title" value={values.title} onChange={setField} />
      </label>
      <label>
        <span>Cover</span>
        <input key={`cover-${fileKey}`} name="photo" type="file" accept="image/*" onChange={setCover} />
        {values.photo ? <img className="admin-photo-preview admin-photo-preview-wide" src={values.photo} alt="" /> : null}
      </label>
      <label>
        <span>Episode</span>
        <div className="episode-number">
          <i>[</i>
          <input name="episodeMajor" inputMode="numeric" value={values.episodeMajor} onChange={(event) => setDigits("episodeMajor", event)} aria-label="Episode number before the dot" required />
          <i>.</i>
          <input name="episodeMinor" inputMode="numeric" value={values.episodeMinor} onChange={(event) => setDigits("episodeMinor", event)} aria-label="Episode number after the dot" required />
          <i>]</i>
        </div>
      </label>
      <label>
        <span>Description</span>
        <textarea name="description" value={values.description} onChange={setField} rows={4} />
      </label>
      <fieldset className="admin-availability">
        <legend>Availability</legend>
        <p className="admin-lead">Choose where this episode is published. A link is saved only for checked platforms.</p>
        {PLATFORMS.map((platform) => (
          <div key={platform.on} className="admin-availability-platform">
            <label className="admin-check">
              <input
                type="checkbox"
                name={platform.on}
                checked={Boolean(values[platform.on])}
                onChange={setPlatform}
              />
              <span>{platform.label}</span>
            </label>
            {values[platform.on] ? (
              <div className="admin-availability-link">
                <p className="admin-availability-banner">{platform.banner}</p>
                <input
                  name={platform.url}
                  value={values[platform.url]}
                  onChange={setField}
                  placeholder="https://"
                />
              </div>
            ) : null}
          </div>
        ))}
        <label>
          <span>Post type</span>
          <select name="postType" value={values.postType} onChange={setField}>
            <option value="">Select post type</option>
            {EPISODE_POST_TYPE_OPTIONS.map((type) => (
              <option key={type.code} value={type.label}>{type.label}</option>
            ))}
          </select>
        </label>
      </fieldset>
      <div className="admin-actions">
        <button className="admin-button" type="submit" disabled={pending || reading > 0}>{pending ? "Saving…" : "Save"}</button>
        {mode === "edit" ? <Link className="admin-button admin-button-quiet" href="/admin/episodes/add">Cancel</Link> : null}
      </div>
      {notice ? <p className="admin-status">{notice}</p> : null}
      {mode === "edit" ? (
        <div className="admin-confirm">
          {confirmDelete ? (
            <div className="admin-actions">
              <p>Delete this episode?</p>
              <button className="admin-button admin-button-danger" type="button" onClick={remove}>Delete</button>
              <button className="admin-button admin-button-quiet" type="button" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          ) : (
            <button className="admin-button admin-button-danger" type="button" onClick={() => setConfirmDelete(true)}>Delete episode</button>
          )}
        </div>
      ) : (
        <Link className="admin-button admin-button-quiet" href="/admin/episodes/add">Back to index</Link>
      )}
    </form>
  );
}

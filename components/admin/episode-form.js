"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const empty = {
  episode: "",
  title: "",
  description: "",
  link: "",
  photo: "",
  programId: "",
  seasonId: "",
};

export function EpisodeForm({ mode, record }) {
  const router = useRouter();
  const [values, setValues] = useState(record ? { ...empty, ...record } : empty);
  const [programs, setPrograms] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [lists, setLists] = useState("loading");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
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
      <p className="admin-lead">The program and season lists come from the database.</p>
      {lists === "loading" ? <p className="admin-status">Loading lists…</p> : null}
      {lists === "error" ? <p className="admin-status">The program and season lists could not be loaded.</p> : null}
      {lists === "ready" && programs.length === 0 ? <p className="admin-status">Add a program before saving an episode.</p> : null}
      {lists === "ready" && seasons.length === 0 ? <p className="admin-status">Add a season before saving an episode.</p> : null}
      <div className="admin-fields">
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
          <span>Episode</span>
          <input name="episode" value={values.episode} onChange={setField} placeholder="1" required />
        </label>
        <label>
          <span>Title</span>
          <input name="title" value={values.title} onChange={setField} />
        </label>
      </div>
      <label>
        <span>Description</span>
        <textarea name="description" value={values.description} onChange={setField} rows={4} />
      </label>
      <label>
        <span>Link</span>
        <input name="link" value={values.link} onChange={setField} placeholder="https://" />
      </label>
      <label>
        <span>Photo address</span>
        <input name="photo" value={values.photo} onChange={setField} placeholder="https://" />
      </label>
      <div className="admin-actions">
        <button className="admin-button" type="submit" disabled={pending}>{pending ? "Saving…" : "Save"}</button>
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

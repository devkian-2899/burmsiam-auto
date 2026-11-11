"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { compareEpisodeNumbersDesc } from "../../lib/catalog-rules.mjs";

export function EpisodeList() {
  const [rows, setRows] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [seasons, setSeasons] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [query, setQuery] = useState("");
  const [programId, setProgramId] = useState("");
  const [seasonId, setSeasonId] = useState("");
  const [applied, setApplied] = useState({ query: "", programId: "", seasonId: "" });
  const [pendingDelete, setPendingDelete] = useState("");

  useEffect(() => {
    let active = true;
    Promise.all([
      fetch("/api/admin/episodes").then((response) => response.json().then((body) => ({ ok: response.ok, body }))),
      fetch("/api/admin/programs").then((response) => response.json()),
      fetch("/api/admin/seasons").then((response) => response.json()),
    ]).then(([episodes, programBody, seasonBody]) => {
      if (!active) return;
      if (!episodes.ok) {
        setStatus("error");
        setMessage(episodes.body.error || "The episodes could not be loaded.");
        return;
      }
      setRows(episodes.body.episodes || []);
      setPrograms(programBody.programs || []);
      setSeasons(seasonBody.seasons || []);
      setStatus("ready");
    }).catch(() => {
      if (!active) return;
      setStatus("error");
      setMessage("The episodes could not be loaded.");
    });
    return () => {
      active = false;
    };
  }, []);

  const visible = useMemo(() => {
    const needle = applied.query.trim().toLowerCase();
    const next = rows.filter((row) => {
      if (applied.programId && row.programId !== applied.programId) return false;
      if (applied.seasonId && row.seasonId !== applied.seasonId) return false;
      if (!needle) return true;
      return `${row.programAbbr} ${row.seasonLabel} ${row.episode} ${row.title}`.toLowerCase().includes(needle);
    });
    next.sort((left, right) => compareEpisodeNumbersDesc(left.episode, right.episode));
    return next;
  }, [applied, rows]);

  async function remove(id) {
    const response = await fetch(`/api/admin/episodes/${id}`, { method: "DELETE" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(body.error || "The episode was not deleted.");
      setPendingDelete("");
      return;
    }
    setRows((current) => current.filter((item) => item.id !== id));
    setMessage("");
    setPendingDelete("");
  }

  return (
    <section className="admin-card">
      <div className="admin-heading">
        <div>
          <h1>Episodes</h1>
          <p className="admin-lead">Each episode belongs to one program and one season.</p>
        </div>
        <Link className="admin-button" href="/admin/episodes/new">New</Link>
      </div>
      <form
        className="admin-filters"
        onSubmit={(event) => {
          event.preventDefault();
          setApplied({ query, programId, seasonId });
        }}
      >
        <label>
          <span>Search</span>
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Title or episode" />
        </label>
        <label>
          <span>Program</span>
          <select value={programId} onChange={(event) => setProgramId(event.target.value)}>
            <option value="">All programs</option>
            {programs.map((program) => (
              <option key={program.id} value={program.id}>{program.abbr}</option>
            ))}
          </select>
        </label>
        <label>
          <span>Season</span>
          <select value={seasonId} onChange={(event) => setSeasonId(event.target.value)}>
            <option value="">All seasons</option>
            {seasons.map((season) => (
              <option key={season.id} value={season.id}>{season.label}</option>
            ))}
          </select>
        </label>
        <button className="admin-button" type="submit">Search</button>
      </form>
      {status === "loading" ? <p className="admin-status">Loading episodes…</p> : null}
      {status === "error" ? <p className="admin-status">{message}</p> : null}
      {message && status === "ready" ? <p className="admin-status">{message}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Program</th>
              <th>Season</th>
              <th>Episode</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {status === "ready" && visible.length === 0 ? (
              <tr>
                <td className="admin-empty" colSpan={5}>No episodes match this search.</td>
              </tr>
            ) : visible.map((row) => (
              <tr key={row.id}>
                <td>{row.programAbbr}</td>
                <td>{row.seasonLabel}</td>
                <td>{row.episode}</td>
                <td>{row.title}</td>
                <td>
                  <div className="admin-row-actions">
                    <Link href={`/admin/episodes/edit?id=${row.id}`}>Edit</Link>
                    {pendingDelete === row.id ? (
                      <>
                        <button type="button" onClick={() => remove(row.id)}>Confirm</button>
                        <button type="button" onClick={() => setPendingDelete("")}>Cancel</button>
                      </>
                    ) : (
                      <button className="admin-text-danger" type="button" onClick={() => setPendingDelete(row.id)}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

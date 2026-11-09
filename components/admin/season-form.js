"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const empty = { season: "", volume: "" };

export function SeasonForm({ mode, record }) {
  const router = useRouter();
  const [values, setValues] = useState(record ? { ...empty, ...record } : empty);
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  function setField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function onSubmit(event) {
    event.preventDefault();
    setNotice("");
    setPending(true);
    const response = await fetch(mode === "edit" ? `/api/admin/seasons/${record.id}` : "/api/admin/seasons", {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setNotice(body.error || "The season was not saved.");
      return;
    }
    router.push("/admin/episodes/seasons");
    router.refresh();
  }

  async function remove() {
    const response = await fetch(`/api/admin/seasons/${record.id}`, { method: "DELETE" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setNotice(body.error || "The season was not deleted.");
      setConfirmDelete(false);
      return;
    }
    router.push("/admin/episodes/seasons");
    router.refresh();
  }

  return (
    <form className="admin-card" onSubmit={onSubmit}>
      <h1>{mode === "edit" ? "Edit season" : "New season"}</h1>
      <p className="admin-lead">A season can be used by any program. Episodes choose it from the list.</p>
      <div className="admin-fields">
        <label>
          <span>Season</span>
          <input name="season" value={values.season} onChange={setField} placeholder="1" required />
        </label>
        <label>
          <span>Volume</span>
          <input name="volume" value={values.volume} onChange={setField} placeholder="1" required />
        </label>
      </div>
      <div className="admin-actions">
        <button className="admin-button" type="submit" disabled={pending}>{pending ? "Saving…" : "Save"}</button>
        <Link className="admin-button admin-button-quiet" href="/admin/episodes/seasons">Cancel</Link>
      </div>
      {notice ? <p className="admin-status">{notice}</p> : null}
      {mode === "edit" ? (
        <div className="admin-confirm">
          {confirmDelete ? (
            <div className="admin-actions">
              <p>Delete Season [{values.season}] Volume [{values.volume}]?</p>
              <button className="admin-button admin-button-danger" type="button" onClick={remove}>Delete</button>
              <button className="admin-button admin-button-quiet" type="button" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          ) : (
            <button className="admin-button admin-button-danger" type="button" onClick={() => setConfirmDelete(true)}>Delete season</button>
          )}
        </div>
      ) : null}
    </form>
  );
}

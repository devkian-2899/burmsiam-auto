"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { readPhoto } from "./read-photo";

const empty = { name: "", abbr: "", description: "", cover: "", icon: "" };

export function ProgramForm({ mode, record }) {
  const router = useRouter();
  const [values, setValues] = useState(record ? { ...empty, ...record } : empty);
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [reading, setReading] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [fileKey, setFileKey] = useState(0);

  function setField(event) {
    const { name, value } = event.target;
    setValues((current) => ({ ...current, [name]: value }));
  }

  async function setPhoto(name, maxEdge, event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setNotice("");
    setReading((count) => count + 1);
    try {
      const photo = await readPhoto(file, maxEdge);
      setValues((current) => ({ ...current, [name]: photo }));
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
    const response = await fetch(mode === "edit" ? `/api/admin/programs/${record.id}` : "/api/admin/programs", {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setNotice(body.error || "The program was not saved.");
      return;
    }
    if (mode === "edit") {
      router.push("/admin/episodes/programs");
      router.refresh();
      return;
    }
    setValues(empty);
    setFileKey((key) => key + 1);
    setNotice("Saved. You can add another.");
  }

  async function remove() {
    const response = await fetch(`/api/admin/programs/${record.id}`, { method: "DELETE" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setNotice(body.error || "The program was not deleted.");
      setConfirmDelete(false);
      return;
    }
    router.push("/admin/episodes/programs");
    router.refresh();
  }

  return (
    <form className="admin-card" onSubmit={onSubmit}>
      <h1>{mode === "edit" ? "Edit program" : "New program"}</h1>
      <p className="admin-lead">The abbreviation is the public page, such as /BSS. Photos are saved with the program.</p>
      <div className="admin-fields">
        <label>
          <span>Abbreviation</span>
          <input name="abbr" value={values.abbr} onChange={setField} placeholder="BSS" required />
        </label>
        <label>
          <span>Name</span>
          <input name="name" value={values.name} onChange={setField} />
        </label>
      </div>
      <label>
        <span>Description</span>
        <textarea name="description" value={values.description} onChange={setField} rows={4} />
      </label>
      <label>
        <span>Background</span>
        <input key={`cover-${fileKey}`} name="cover" type="file" accept="image/*" onChange={(event) => setPhoto("cover", 1920, event)} />
        {values.cover ? <img className="admin-photo-preview admin-photo-preview-wide" src={values.cover} alt="" /> : null}
      </label>
      <label>
        <span>Icon</span>
        <input key={`icon-${fileKey}`} name="icon" type="file" accept="image/*" onChange={(event) => setPhoto("icon", 1080, event)} />
        {values.icon ? <img className="admin-photo-preview" src={values.icon} alt="" /> : null}
      </label>
      <div className="admin-actions">
        <button className="admin-button" type="submit" disabled={pending || reading > 0}>{pending ? "Saving…" : "Save"}</button>
        {mode === "edit" ? <Link className="admin-button admin-button-quiet" href="/admin/episodes/programs">Cancel</Link> : null}
      </div>
      {notice ? <p className="admin-status">{notice}</p> : null}
      {mode === "edit" ? (
        <div className="admin-confirm">
          {confirmDelete ? (
            <div className="admin-actions">
              <p>Delete {values.abbr || "this program"}?</p>
              <button className="admin-button admin-button-danger" type="button" onClick={remove}>Delete</button>
              <button className="admin-button admin-button-quiet" type="button" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          ) : (
            <button className="admin-button admin-button-danger" type="button" onClick={() => setConfirmDelete(true)}>Delete program</button>
          )}
        </div>
      ) : (
        <Link className="admin-button admin-button-quiet" href="/admin/episodes/programs">Back to index</Link>
      )}
    </form>
  );
}

"use client";

import Link from "next/link";
import { useState } from "react";
import { finishAdminEdit } from "./finish-admin-edit";
import { readPhoto } from "./read-photo";

const empty = { photo: "", link: "" };

export function SlideForm({ mode, record }) {
  const [values, setValues] = useState(record ? { ...empty, ...record } : empty);
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);
  const [reading, setReading] = useState(false);
  const [fileKey, setFileKey] = useState(0);
  const [confirmDelete, setConfirmDelete] = useState(false);

  async function setPhoto(event) {
    const file = event.target.files?.[0];
    if (!file) return;
    setNotice("");
    setReading(true);
    try {
      const photo = await readPhoto(file, 1920);
      setValues((current) => ({ ...current, photo }));
    } catch (error) {
      setNotice(error.message || "That photo could not be read.");
    } finally {
      setReading(false);
    }
  }

  async function onSubmit(event) {
    event.preventDefault();
    setNotice("");
    setPending(true);
    const response = await fetch(mode === "edit" ? `/api/admin/slides/${record.id}` : "/api/admin/slides", {
      method: mode === "edit" ? "PATCH" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setNotice(body.error || "The slide was not saved.");
      return;
    }
    if (mode === "edit") {
      finishAdminEdit("/admin/content/slides");
      return;
    }
    setValues(empty);
    setFileKey((key) => key + 1);
    setNotice("Saved. You can add another.");
  }

  async function remove() {
    const response = await fetch(`/api/admin/slides/${record.id}`, { method: "DELETE" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setNotice(body.error || "The slide was not deleted.");
      setConfirmDelete(false);
      return;
    }
    finishAdminEdit("/admin/content/slides");
  }

  return (
    <form className="admin-card" onSubmit={onSubmit}>
      <h1>{mode === "edit" ? "Edit slide" : "New slide"}</h1>
      <p className="admin-lead">Upload the photo. It is saved with the slide. The link opens when a visitor taps the photo.</p>
      <label>
        <span>Photo</span>
        <input key={`photo-${fileKey}`} name="photo" type="file" accept="image/*" onChange={setPhoto} />
        {values.photo ? <img className="admin-photo-preview admin-photo-preview-wide" src={values.photo} alt="" /> : null}
      </label>
      <label>
        <span>Link</span>
        <input name="link" value={values.link} onChange={(event) => setValues((current) => ({ ...current, link: event.target.value }))} placeholder="https://" />
      </label>
      <div className="admin-actions">
        <button className="admin-button" type="submit" disabled={pending || reading}>{pending ? "Saving…" : "Save"}</button>
        {mode === "edit" ? <Link className="admin-button admin-button-quiet" href="/admin/content/slides">Cancel</Link> : null}
      </div>
      {notice ? <p className="admin-status">{notice}</p> : null}
      {mode === "edit" ? (
        <div className="admin-confirm">
          {confirmDelete ? (
            <div className="admin-actions">
              <p>Delete this slide?</p>
              <button className="admin-button admin-button-danger" type="button" onClick={remove}>Delete</button>
              <button className="admin-button admin-button-quiet" type="button" onClick={() => setConfirmDelete(false)}>Cancel</button>
            </div>
          ) : (
            <button className="admin-button admin-button-danger" type="button" onClick={() => setConfirmDelete(true)}>Delete slide</button>
          )}
        </div>
      ) : (
        <Link className="admin-button admin-button-quiet" href="/admin/content/slides">Back to index</Link>
      )}
    </form>
  );
}

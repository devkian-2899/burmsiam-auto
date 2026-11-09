"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const empty = { name: "", abbr: "", description: "", cover: "", icon: "" };

export function ProgramForm({ mode, record }) {
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
    router.push("/admin/episodes/programs");
    router.refresh();
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
      <p className="admin-lead">The abbreviation is the public page, such as /BSS.</p>
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
        <span>Cover photo address</span>
        <input name="cover" value={values.cover} onChange={setField} placeholder="https://" />
      </label>
      <label>
        <span>Icon address</span>
        <input name="icon" value={values.icon} onChange={setField} placeholder="/images/programs/BSS.png" />
      </label>
      <div className="admin-actions">
        <button className="admin-button" type="submit" disabled={pending}>{pending ? "Saving…" : "Save"}</button>
        <Link className="admin-button admin-button-quiet" href="/admin/episodes/programs">Cancel</Link>
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
      ) : null}
    </form>
  );
}

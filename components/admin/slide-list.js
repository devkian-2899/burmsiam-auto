"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function SlideList() {
  const [rows, setRows] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState("");

  useEffect(() => {
    let active = true;
    fetch("/api/admin/slides")
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!active) return;
        if (!response.ok) {
          setStatus("error");
          setMessage(body.error || "The slides could not be loaded.");
          return;
        }
        setRows(body.slides || []);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
        setMessage("The slides could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, []);

  async function remove(id) {
    const response = await fetch(`/api/admin/slides/${id}`, { method: "DELETE" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(body.error || "The slide was not deleted.");
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
          <h1>Explore the Latest</h1>
          <p className="admin-lead">Newest slides appear first. Each photo is saved with the slide.</p>
        </div>
        <Link className="admin-button" href="/admin/content/slides/new">New</Link>
      </div>
      {status === "loading" ? <p className="admin-status">Loading slides…</p> : null}
      {status === "error" ? <p className="admin-status">{message}</p> : null}
      {message && status === "ready" ? <p className="admin-status">{message}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Photo</th>
              <th>Link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {status === "ready" && rows.length === 0 ? (
              <tr>
                <td className="admin-empty" colSpan={3}>No slides yet.</td>
              </tr>
            ) : rows.map((row) => (
              <tr key={row.id}>
                <td>{row.hasPhoto ? "Saved" : "Missing"}</td>
                <td>{row.link || "—"}</td>
                <td>
                  <div className="admin-row-actions">
                    <Link href={`/admin/content/slides/edit?id=${row.id}`}>Edit</Link>
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

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function YoutubeList() {
  const [row, setRow] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");
  const [pendingDelete, setPendingDelete] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/youtube")
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!active) return;
        if (!response.ok) {
          setStatus("error");
          setMessage(body.error || "The YouTube link could not be loaded.");
          return;
        }
        setRow(body.youtube);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
        setMessage("The YouTube link could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, []);

  async function remove() {
    const response = await fetch("/api/admin/youtube", { method: "DELETE" });
    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      setMessage(body.error || "The YouTube link was not cleared.");
      setPendingDelete(false);
      return;
    }
    setRow((current) => (current ? { ...current, link: "" } : null));
    setMessage("");
    setPendingDelete(false);
  }

  const link = row?.link || "";

  return (
    <section className="admin-card">
      <div className="admin-heading">
        <div>
          <h1>YouTube link</h1>
          <p className="admin-lead">This film plays beside the slogan on the home page.</p>
        </div>
        <Link className="admin-button" href="/admin/content/youtube/edit">{link ? "Edit" : "Add"}</Link>
      </div>
      {status === "loading" ? <p className="admin-status">Loading the YouTube link…</p> : null}
      {status === "error" ? <p className="admin-status">{message}</p> : null}
      {message && status === "ready" ? <p className="admin-status">{message}</p> : null}
      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>YouTube link</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {status === "ready" && !link ? (
              <tr>
                <td className="admin-empty" colSpan={2}>No YouTube link yet.</td>
              </tr>
            ) : null}
            {status === "ready" && link ? (
              <tr>
                <td>{link}</td>
                <td>
                  <div className="admin-row-actions">
                    <Link href="/admin/content/youtube/edit">Edit</Link>
                    {pendingDelete ? (
                      <>
                        <button type="button" onClick={remove}>Confirm</button>
                        <button type="button" onClick={() => setPendingDelete(false)}>Cancel</button>
                      </>
                    ) : (
                      <button className="admin-text-danger" type="button" onClick={() => setPendingDelete(true)}>Delete</button>
                    )}
                  </div>
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </section>
  );
}

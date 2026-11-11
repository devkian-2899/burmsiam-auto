"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { finishAdminEdit } from "./finish-admin-edit";

export function YoutubeForm() {
  const [currentLink, setCurrentLink] = useState("");
  const [newLink, setNewLink] = useState("");
  const [status, setStatus] = useState("loading");
  const [notice, setNotice] = useState("");
  const [pending, setPending] = useState(false);

  useEffect(() => {
    let active = true;
    fetch("/api/admin/youtube")
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!active) return;
        if (!response.ok) {
          setStatus("error");
          setNotice(body.error || "The YouTube link could not be loaded.");
          return;
        }
        setCurrentLink(body.youtube?.link || "");
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("error");
        setNotice("The YouTube link could not be loaded.");
      });
    return () => {
      active = false;
    };
  }, []);

  async function onSubmit(event) {
    event.preventDefault();
    const link = newLink.trim();
    if (!link) {
      setNotice("Add new video link here before you save.");
      return;
    }
    setNotice("");
    setPending(true);
    const response = await fetch("/api/admin/youtube", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ link }),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setNotice(body.error || "The YouTube link was not saved.");
      return;
    }
    finishAdminEdit("/admin/content/youtube");
  }

  return (
    <form className="admin-card" onSubmit={onSubmit}>
      <h1>Edit YouTube link</h1>
      <p className="admin-lead">
        The home page uses the same embed as now. Paste a full embed link, for example
        {" "}
        <code>https://www.youtube.com/embed/VIDEO_ID?si=...</code>
        .
      </p>
      {status === "loading" ? <p className="admin-status">Loading the YouTube link…</p> : null}
      {status === "error" ? <p className="admin-status">{notice}</p> : null}
      <label>
        <span>Current video link</span>
        <input
          name="currentLink"
          value={currentLink}
          readOnly
          tabIndex={-1}
          placeholder="No video link saved yet"
          aria-readonly="true"
          className="admin-readonly"
        />
      </label>
      <label>
        <span>New video link</span>
        <input
          name="newLink"
          value={newLink}
          onChange={(event) => setNewLink(event.target.value)}
          placeholder="Add new video link here..."
        />
      </label>
      <div className="admin-actions">
        <button className="admin-button" type="submit" disabled={pending || status !== "ready"}>{pending ? "Saving…" : "Update"}</button>
        <Link className="admin-button admin-button-quiet" href="/admin/content/youtube">Back to index</Link>
      </div>
      {status === "ready" && notice ? <p className="admin-status">{notice}</p> : null}
    </form>
  );
}

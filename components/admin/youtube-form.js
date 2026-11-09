"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export function YoutubeForm() {
  const router = useRouter();
  const [link, setLink] = useState("");
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
        setLink(body.youtube?.link || "");
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
    router.push("/admin/content/youtube");
    router.refresh();
  }

  return (
    <form className="admin-card" onSubmit={onSubmit}>
      <h1>Edit YouTube link</h1>
      <p className="admin-lead">Paste a watch link, a youtu.be link, or the video id. The home page plays this film.</p>
      {status === "loading" ? <p className="admin-status">Loading the YouTube link…</p> : null}
      {status === "error" ? <p className="admin-status">{notice}</p> : null}
      <label>
        <span>YouTube link</span>
        <input name="link" value={link} onChange={(event) => setLink(event.target.value)} placeholder="https://youtu.be/" required />
      </label>
      <div className="admin-actions">
        <button className="admin-button" type="submit" disabled={pending || status !== "ready"}>{pending ? "Saving…" : "Save"}</button>
        <Link className="admin-button admin-button-quiet" href="/admin/content/youtube">Back to index</Link>
      </div>
      {status === "ready" && notice ? <p className="admin-status">{notice}</p> : null}
    </form>
  );
}

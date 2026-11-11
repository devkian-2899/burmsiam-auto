"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export function CatalogEditor({ endpoint, recordKey, missing, Form }) {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const [record, setRecord] = useState(null);
  const [status, setStatus] = useState(id ? "loading" : "missing");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) return undefined;
    let active = true;
    fetch(`${endpoint}/${id}`)
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!active) return;
        if (!response.ok || !body[recordKey]) {
          setStatus("missing");
          setMessage(body.error || missing);
          return;
        }
        setRecord(body[recordKey]);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("missing");
        setMessage(missing);
      });
    return () => {
      active = false;
    };
  }, [endpoint, id, missing, recordKey]);

  if (status === "loading") return <p className="admin-status">Loading…</p>;
  if (!record) {
    return (
      <section className="admin-card">
        <h1>{missing}</h1>
        <p className="admin-lead">{message}</p>
      </section>
    );
  }
  return <Form key={id} mode="edit" record={record} />;
}

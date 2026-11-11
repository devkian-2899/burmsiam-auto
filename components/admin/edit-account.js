"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { UserForm } from "./user-form";

export function EditAccount() {
  const params = useSearchParams();
  const id = params.get("id") || "";
  const [user, setUser] = useState(null);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!id) {
      setStatus("missing");
      return undefined;
    }
    let active = true;
    fetch(`/api/admin/staff/${id}`)
      .then(async (response) => {
        const body = await response.json().catch(() => ({}));
        if (!active) return;
        if (!response.ok) {
          setStatus("missing");
          setMessage(body.error || "Account not found.");
          return;
        }
        setUser(body.staff);
        setStatus("ready");
      })
      .catch(() => {
        if (!active) return;
        setStatus("missing");
        setMessage("Account not found.");
      });
    return () => {
      active = false;
    };
  }, [id]);

  if (status === "loading") return <p className="admin-status">Loading account…</p>;
  if (!user) {
    return (
      <section className="admin-card">
        <h1>Account not found</h1>
        <p className="admin-lead">{message || "That account is not in the database."}</p>
      </section>
    );
  }
  return <UserForm key={id} mode="edit" user={user} />;
}

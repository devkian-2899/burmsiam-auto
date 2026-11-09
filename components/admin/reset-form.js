"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function ResetForm() {
  const params = useSearchParams();
  const router = useRouter();
  const token = params.get("token") || "";
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        token,
        password: form.get("password"),
        confirm: form.get("confirm"),
      }),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setError(body.error || "The password was not changed.");
      return;
    }
    router.push("/admin?reset=1");
  }

  return (
    <main className="admin-gate">
      <form className="admin-card" onSubmit={onSubmit}>
        <img className="admin-mark" src="/images/main/logob.png" alt="BurmSiamAuto" />
        <h1>Choose a new password</h1>
        <p className="admin-lead">Use at least 8 characters. This signs every session out of that account.</p>
        {token ? null : <p className="admin-status">This reset link is missing. Ask for a new one.</p>}
        <label>
          <span>New password</span>
          <input name="password" type="password" autoComplete="new-password" required />
        </label>
        <label>
          <span>Confirm password</span>
          <input name="confirm" type="password" autoComplete="new-password" required />
        </label>
        <button className="admin-button" type="submit" disabled={pending || !token}>{pending ? "Saving…" : "Update password"}</button>
        {error ? <p className="admin-status">{error}</p> : null}
        <Link className="admin-quiet" href="/admin/forgot">Request a new link</Link>
      </form>
    </main>
  );
}

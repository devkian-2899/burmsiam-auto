"use client";

import Link from "next/link";
import { useState } from "react";

export function ForgotForm() {
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);

  async function onSubmit(event) {
    event.preventDefault();
    setMessage("");
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/forgot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.get("email") }),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setError(body.error || "The reset email could not be sent.");
      return;
    }
    setMessage(body.message || "If that email is on a staff account, a reset link is on its way.");
  }

  return (
    <main className="admin-gate">
      <form className="admin-card" onSubmit={onSubmit}>
        <img className="admin-mark" src="/images/main/logob.png" alt="BurmSiamAuto" />
        <h1>Forgot password</h1>
        <p className="admin-lead">Enter the email on the staff account. The reset link stays valid for one hour.</p>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="name@burmsiamauto.com" required />
        </label>
        <button className="admin-button" type="submit" disabled={pending}>{pending ? "Sending…" : "Send reset link"}</button>
        {message ? <p className="admin-status">{message}</p> : null}
        {error ? <p className="admin-status">{error}</p> : null}
        <Link className="admin-quiet" href="/login">Back to log in</Link>
      </form>
    </main>
  );
}

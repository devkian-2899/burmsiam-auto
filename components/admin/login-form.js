"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [error, setError] = useState("");
  const [pending, setPending] = useState(false);
  const reset = params.get("reset") === "1";

  async function onSubmit(event) {
    event.preventDefault();
    setError("");
    setPending(true);
    const form = new FormData(event.currentTarget);
    const response = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        identity: form.get("identity"),
        password: form.get("password"),
        remember: form.get("remember") === "on",
      }),
    });
    const body = await response.json().catch(() => ({}));
    setPending(false);
    if (!response.ok) {
      setError(body.error || "Sign-in failed.");
      return;
    }
    router.push("/admin/visual");
    router.refresh();
  }

  return (
    <main className="admin-gate">
      <form className="admin-card" onSubmit={onSubmit}>
        <img className="admin-mark" src="/images/main/logob.png" alt="BurmSiamAuto" />
        <h1>Log in</h1>
        <p className="admin-lead">Staff sign in for BurmSiamAuto.</p>
        {reset ? <p className="admin-status">Password updated. Log in with the new password.</p> : null}
        <label>
          <span>Email, phone, or username</span>
          <input name="identity" type="text" autoComplete="username" placeholder="name@burmsiamauto.com" required />
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" autoComplete="current-password" required />
        </label>
        <label className="admin-check">
          <input name="remember" type="checkbox" />
          <span>Remember me</span>
        </label>
        <button className="admin-button" type="submit" disabled={pending}>{pending ? "Signing in…" : "Log in"}</button>
        {error ? <p className="admin-status">{error}</p> : null}
        <Link className="admin-quiet" href="/login/forgot">Forgot password</Link>
      </form>
    </main>
  );
}

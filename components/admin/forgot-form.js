"use client";

import Link from "next/link";
import { useState } from "react";

export function ForgotForm() {
  const [sent, setSent] = useState(false);

  function onSubmit(event) {
    event.preventDefault();
    setSent(true);
  }

  return (
    <main className="admin-gate">
      <form className="admin-card" onSubmit={onSubmit}>
        <img className="admin-mark" src="/images/main/logob.png" alt="BurmSiamAuto" />
        <h1>Forgot password</h1>
        <p className="admin-lead">Enter the email on the account. Nothing is sent in this preview.</p>
        <label>
          <span>Email</span>
          <input name="email" type="email" autoComplete="email" placeholder="name@burmsiamauto.com" />
        </label>
        <button className="admin-button" type="submit">Send reset link</button>
        {sent ? <p className="admin-status">Preview only. No email was sent.</p> : null}
        <Link className="admin-quiet" href="/admin">Back to log in</Link>
      </form>
    </main>
  );
}

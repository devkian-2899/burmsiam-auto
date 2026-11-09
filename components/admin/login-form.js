"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export function LoginForm() {
  const router = useRouter();

  function onSubmit(event) {
    event.preventDefault();
    router.push("/admin/users");
  }

  return (
    <main className="admin-gate">
      <form className="admin-card" onSubmit={onSubmit}>
        <img className="admin-mark" src="/images/main/logob.png" alt="BurmSiamAuto" />
        <h1>Log in</h1>
        <p className="admin-lead">Staff sign in. This screen is a preview.</p>
        <label>
          <span>Email, phone, or username</span>
          <input name="identity" type="text" autoComplete="username" placeholder="name@burmsiamauto.com" />
        </label>
        <label>
          <span>Password</span>
          <input name="password" type="password" autoComplete="current-password" />
        </label>
        <label className="admin-check">
          <input name="remember" type="checkbox" />
          <span>Remember me</span>
        </label>
        <button className="admin-button" type="submit">Log in</button>
        <Link className="admin-quiet" href="/admin/forgot">Forgot password</Link>
      </form>
    </main>
  );
}

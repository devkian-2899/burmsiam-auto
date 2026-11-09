import Link from "next/link";

export function AdminShell({ children }) {
  return (
    <div className="admin-app">
      <header className="admin-bar">
        <Link className="admin-brand" href="/admin/users">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/images/main/logob.png" alt="BurmSiamAuto" />
          <span>Accounts</span>
        </Link>
        <nav className="admin-nav">
          <Link href="/admin/users">All accounts</Link>
          <Link href="/admin/users/new">New account</Link>
          <Link href="/admin">Log out</Link>
        </nav>
      </header>
      <div className="admin-wrap">{children}</div>
    </div>
  );
}

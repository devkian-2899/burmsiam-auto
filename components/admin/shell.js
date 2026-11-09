"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const groups = [
  {
    label: "Site Visual Management",
    href: "/admin/visual",
  },
  {
    label: "Content Management",
    items: [
      { href: "/admin/content/youtube", label: "Change recent YouTube link" },
      { href: "/admin/content/slides", label: "Change slideshow Latest Explore" },
    ],
  },
  {
    label: "Episode Management",
    items: [
      { href: "/admin/episodes/programs", label: "Add more Program" },
      { href: "/admin/episodes/seasons", label: "Add more Season" },
      { href: "/admin/episodes/add", label: "Add more episodes" },
    ],
  },
  {
    label: "Account Management",
    href: "/admin/users",
  },
];

function active(path, href) {
  return path === href || path.startsWith(`${href}/`);
}

export function AdminShell({ children }) {
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [path]);

  return (
    <div className="admin-app">
      <header className="admin-bar">
        <div className="admin-bar-left">
          <button
            className="admin-menu-button"
            type="button"
            aria-expanded={open}
            aria-controls="admin-side"
            onClick={() => setOpen((value) => !value)}
          >
            Menu
          </button>
          <Link className="admin-brand" href="/admin/visual">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/images/main/logob.png" alt="BurmSiamAuto" />
          </Link>
        </div>
        <Link className="admin-logout" href="/admin">Log out</Link>
      </header>
      {open ? <button className="admin-scrim" type="button" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
      <aside id="admin-side" className={open ? "admin-side is-open" : "admin-side"}>
        <nav>
          {groups.map((group) => (
            <div key={group.label}>
              {group.href ? (
                <Link className={active(path, group.href) ? "is-active" : ""} href={group.href}>
                  {group.label}
                </Link>
              ) : (
                <p className="admin-side-group">{group.label}</p>
              )}
              {group.items ? (
                <div className="admin-side-sub">
                  {group.items.map((item) => (
                    <Link key={item.href} className={active(path, item.href) ? "is-active" : ""} href={item.href}>
                      {item.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </div>
          ))}
        </nav>
      </aside>
      <main className="admin-main">{children}</main>
    </div>
  );
}

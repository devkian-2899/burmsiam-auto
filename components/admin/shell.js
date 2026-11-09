"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
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
      { href: "/admin/episodes/programs", label: "Programs" },
      { href: "/admin/episodes/seasons", label: "Seasons" },
      {
        href: "/admin/episodes/add",
        label: "Episodes",
        match: ["/admin/episodes/add", "/admin/episodes/new", "/admin/episodes/edit"],
      },
    ],
  },
  {
    label: "Account Management",
    href: "/admin/users",
  },
];

function active(path, item) {
  const hrefs = item.match || [item.href];
  return hrefs.some((href) => path === href || path.startsWith(`${href}/`));
}

function LogoutButton() {
  const router = useRouter();

  async function onClick() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <button className="admin-logout" type="button" onClick={onClick}>Log out</button>
  );
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
        <LogoutButton />
      </header>
      {open ? <button className="admin-scrim" type="button" aria-label="Close menu" onClick={() => setOpen(false)} /> : null}
      <aside id="admin-side" className={open ? "admin-side is-open" : "admin-side"}>
        <nav>
          {groups.map((group) => (
            <div key={group.label}>
              {group.href ? (
                <Link className={active(path, group) ? "is-active" : ""} href={group.href}>
                  {group.label}
                </Link>
              ) : (
                <p className="admin-side-group">{group.label}</p>
              )}
              {group.items ? (
                <div className="admin-side-sub">
                  {group.items.map((item) => (
                    <Link key={item.href} className={active(path, item) ? "is-active" : ""} href={item.href}>
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

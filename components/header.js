"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#home", label: "HOME" },
  { href: "#aboutus", label: "ABOUT" },
  { href: "#latest", label: "EXPLORE THE LATEST", soon: true },
  { href: "#programs", label: "OUR PROGRAMS" },
  { href: "#contact", label: "CONTACT US" },
];

const sections = ["home", "aboutus", "programs", "contact"];

export function Header({ name, logo }) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 861px)");

    function onScroll() {
      if (!desktop.matches) return;
      const line = window.scrollY + window.innerHeight * 0.35;
      const atBottom = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 2;
      let current = sections[0];
      for (const id of sections) {
        const section = document.getElementById(id);
        if (!section) continue;
        const top = section.getBoundingClientRect().top + window.scrollY;
        if (top <= line) current = id;
      }
      if (atBottom) current = sections[sections.length - 1];
      const next = `#${current}`;
      if (window.location.hash !== next) {
        window.history.replaceState(null, "", next);
      }
    }

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    desktop.addEventListener("change", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      desktop.removeEventListener("change", onScroll);
    };
  }, []);

  return (
    <header className="site-header">
      <a className="wordmark" href="#home">
        {name}
      </a>
      <a className="logo-link" href="#home">
        {/* The mark is a file in this project. Replace public/logo.svg on GitHub. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img className="brand-logo" src={logo} alt="BurmSiam" />
      </a>
      <button
        className={open ? "menu-button is-open" : "menu-button"}
        type="button"
        aria-expanded={open}
        aria-controls="site-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <span className="menu-line" />
        <span className="menu-line" />
        <span className="menu-line" />
        <span className="visually-hidden">{open ? "Close menu" : "Open menu"}</span>
      </button>
      {open ? (
        <nav id="site-menu" className="site-menu">
          <p className="menu-title">{name}</p>
          {links.map((link) => (
            link.soon ? (
              <p key={link.label} className="menu-soon">
                {link.label}
                <small>[Coming Soon...]</small>
              </p>
            ) : (
              <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
                {link.label}
              </a>
            )
          ))}
        </nav>
      ) : null}
    </header>
  );
}

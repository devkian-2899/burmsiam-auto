"use client";

import { useEffect, useState } from "react";

const links = [
  { href: "#home", label: "HOME" },
  { href: "#about", label: "About Us" },
  { href: "#latest", label: "EXPLORE THE LATEST" },
  { href: "#programs", label: "OUR PROGRAMS" },
  { href: "#contact", label: "CONTACT US" },
];

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
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              {link.label}
            </a>
          ))}
        </nav>
      ) : null}
    </header>
  );
}

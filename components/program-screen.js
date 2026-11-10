"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { EpisodeCard } from "./episode-card";

function menuLinks(hasLatest) {
  return [
    { href: "/#home", label: "HOME" },
    { href: "/#aboutus", label: "ABOUT" },
    { href: "/#latest", label: "EXPLORE THE LATEST", soon: !hasLatest },
    { href: "/#programs", label: "OUR PROGRAMS" },
    { href: "/#contact", label: "CONTACT US" },
  ];
}

function volumeId(volume) {
  return `${volume.season}-${volume.volume}`;
}

export function ProgramScreen({ name, icon, logo, cover, description, volumes, hasLatest = false }) {
  const [openId, setOpenId] = useState(volumes[0] ? volumeId(volumes[0]) : "");
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onKey = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  function toggleVolume(id) {
    if (!window.matchMedia("(max-width: 860px)").matches) return;
    setOpenId((current) => (current === id ? "" : id));
  }

  return (
    <>
      <header className="program-top">
        <Link className="program-back" href="/#programs">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path d="M15 5L8 12l7 7" fill="none" stroke="currentColor" strokeWidth="1.8" />
          </svg>
          <span className="visually-hidden">Back to programs</span>
        </Link>
        <h1 className="program-abbr">{name}</h1>
        <Link className="program-brand" href="/#home">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="brand-logo" src={logo} alt="BurmSiam" />
        </Link>
        <button
          className={menuOpen ? "menu-button program-menu is-open" : "menu-button program-menu"}
          type="button"
          aria-expanded={menuOpen}
          aria-controls="program-menu"
          onClick={() => setMenuOpen((value) => !value)}
        >
          <span className="menu-line" />
          <span className="menu-line" />
          <span className="menu-line" />
          <span className="visually-hidden">{menuOpen ? "Close menu" : "Open menu"}</span>
        </button>
        {menuOpen ? (
          <nav id="program-menu" className="site-menu">
            <p className="menu-title">{name}</p>
            {menuLinks(hasLatest).map((link) => (
              link.soon ? (
                <p key={link.label} className="menu-soon">
                  {link.label}
                  <small>[Coming Soon...]</small>
                </p>
              ) : (
                <Link key={link.href} href={link.href} onClick={() => setMenuOpen(false)}>
                  {link.label}
                </Link>
              )
            ))}
          </nav>
        ) : null}
      </header>
      <section className="program-cover">
        {cover ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img className="program-cover-photo" src={cover} alt="" />
        ) : null}
        <div className="program-cover-shade" />
        <div className="program-cover-copy">
          {icon ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="program-cover-logo" src={icon} alt="" />
          ) : null}
          {description ? <p>{description}</p> : null}
        </div>
      </section>
      {volumes.length > 0 ? <main className="program-stage">
        {volumes.map((volume) => {
          const id = volumeId(volume);
          const open = openId === id;
          return (
            <section key={id} className={open ? "volume is-open" : "volume"}>
              <h2 className="volume-heading">
                <button
                  className="volume-toggle"
                  type="button"
                  aria-expanded={open}
                  onClick={() => toggleVolume(id)}
                >
                  <span>
                    Season [{volume.season}], Volume [{volume.volume}]
                  </span>
                  <svg className="volume-chevron" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M9 6l6 6-6 6" fill="none" stroke="currentColor" strokeWidth="2" />
                  </svg>
                </button>
              </h2>
              <div className="episode-grid">
                {volume.episodes.map((episode) => (
                  <EpisodeCard key={episode.id || `${id}-${episode.episode}`} episode={episode} />
                ))}
              </div>
            </section>
          );
        })}
      </main> : null}
    </>
  );
}

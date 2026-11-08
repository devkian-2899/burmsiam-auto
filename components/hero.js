"use client";

import { useEffect, useState } from "react";

const HOLD_MS = 7000;

export function Hero({ slogan, youtubeId, covers }) {
  const images = (covers || []).filter((src) => String(src || "").trim());
  const embed = youtubeId
    ? `https://www.youtube-nocookie.com/embed/${youtubeId}`
    : "";
  const [index, setIndex] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (reduced || images.length < 2) return undefined;
    const timer = setInterval(() => {
      setIndex((value) => (value + 1) % images.length);
    }, HOLD_MS);
    return () => clearInterval(timer);
  }, [reduced, images.length]);

  return (
    <section id="home" className="hero">
      <div className="hero-slides" aria-hidden="true">
        {images.map((src, position) => (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            key={src}
            src={src}
            alt=""
            className={position === index ? "hero-bg is-active" : "hero-bg"}
            draggable="false"
          />
        ))}
      </div>
      <div className="hero-shade" />
      <div className="hero-inner">
        <h1 className="slogan">{slogan}</h1>
        <div className="player-block">
          <p className="episode-label">Recent Episode</p>
          <div className="player">
            {embed ? (
              <iframe
                src={embed}
                title="Recent episode"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            ) : (
              <p className="player-note">The latest film will play here.</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

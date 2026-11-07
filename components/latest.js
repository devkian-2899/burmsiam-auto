"use client";

import { useEffect, useRef, useState } from "react";
import { Photo } from "./photo";

const STILL_MS = 5000;
const SLIDE_MS = 700;

export function Latest({ slides }) {
  const count = slides.length;
  const frameRef = useRef(null);
  const startX = useRef(0);
  const moved = useRef(false);
  const [index, setIndex] = useState(count > 1 ? 1 : 0);
  const [animate, setAnimate] = useState(true);
  const [settled, setSettled] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  const pages = count > 1 ? [slides[count - 1], ...slides, slides[0]] : slides;

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(media.matches);
    apply();
    media.addEventListener("change", apply);
    return () => media.removeEventListener("change", apply);
  }, []);

  useEffect(() => {
    if (!settled || paused || reduced || count < 2 || document.hidden) return undefined;
    const timer = setTimeout(() => {
      setAnimate(true);
      setSettled(false);
      setIndex((value) => value + 1);
    }, STILL_MS);
    return () => clearTimeout(timer);
  }, [settled, paused, reduced, count, index]);

  useEffect(() => {
    if (animate) return undefined;
    const frame = requestAnimationFrame(() => {
      setAnimate(true);
      setSettled(true);
    });
    return () => cancelAnimationFrame(frame);
  }, [animate, index]);

  function onTransitionEnd(event) {
    if (event.target !== event.currentTarget || event.propertyName !== "transform") return;
    if (count < 2) {
      setSettled(true);
      return;
    }
    if (index === count + 1) {
      setAnimate(false);
      setIndex(1);
      return;
    }
    if (index === 0) {
      setAnimate(false);
      setIndex(count);
      return;
    }
    setSettled(true);
  }

  function go(direction) {
    if (!settled || count < 2) return;
    if (reduced) {
      setAnimate(false);
      setIndex((value) => {
        const next = value + direction;
        if (next > count) return 1;
        if (next < 1) return count;
        return next;
      });
      return;
    }
    setAnimate(true);
    setSettled(false);
    setIndex((value) => value + direction);
  }

  function onPointerDown(event) {
    if (event.pointerType === "mouse" && event.button !== 0) return;
    startX.current = event.clientX;
    moved.current = false;
  }

  function onPointerUp(event) {
    const distance = event.clientX - startX.current;
    if (Math.abs(distance) < 48) return;
    moved.current = true;
    go(distance < 0 ? 1 : -1);
  }

  if (count === 0) {
    return (
      <section id="latest" className="latest latest-empty">
        <p>Explore the Latest</p>
      </section>
    );
  }

  return (
    <section id="latest" className="latest" aria-roledescription="carousel" aria-label="Explore the Latest">
      <div
        ref={frameRef}
        className={settled ? "latest-frame is-settled" : "latest-frame is-moving"}
        onMouseEnter={() => {
          if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) setPaused(true);
        }}
        onMouseLeave={() => setPaused(false)}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
      >
        <div
          className={animate && !reduced ? "latest-track" : "latest-track is-instant"}
          style={{ transform: `translate3d(calc(${-index} * 100cqw), 0, 0)` }}
          onTransitionEnd={onTransitionEnd}
        >
          {pages.map((slide, position) => {
            const linked = Boolean(slide.href);
            const Tag = linked ? "a" : "div";
            return (
              <Tag
                key={`${slide.title}-${position}`}
                className="latest-slide"
                href={linked ? slide.href : undefined}
                target={linked ? "_blank" : undefined}
                rel={linked ? "noopener noreferrer" : undefined}
                onClick={(event) => {
                  if (!settled || moved.current || !slide.href) {
                    event.preventDefault();
                    moved.current = false;
                  }
                }}
              >
                <Photo
                  src={slide.image.src}
                  srcSet={slide.image.srcSet}
                  sizes="100vw"
                  alt={slide.title || "Latest story"}
                  className="latest-photo"
                  eager={position === 1}
                />
                <span className="latest-glow" />
              </Tag>
            );
          })}
        </div>
        {count > 1 ? (
          <>
            <button className="latest-nav latest-prev" type="button" aria-label="Previous story" onClick={() => go(-1)}>
              <span aria-hidden="true">‹</span>
            </button>
            <button className="latest-nav latest-next" type="button" aria-label="Next story" onClick={() => go(1)}>
              <span aria-hidden="true">›</span>
            </button>
          </>
        ) : null}
      </div>
    </section>
  );
}

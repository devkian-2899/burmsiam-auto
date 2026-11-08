"use client";

import { useEffect, useRef, useState } from "react";

const TRACK = "/audio/explore-bg.mp3";
const DEFAULT_VOLUME = 0.7;

export function EngineSound() {
  const audioRef = useRef(null);
  const [on, setOn] = useState(false);
  const [volume, setVolume] = useState(DEFAULT_VOLUME);

  useEffect(() => {
    const audio = audioRef.current;
    return () => {
      if (!audio) return;
      audio.pause();
    };
  }, []);

  function applyVolume(next) {
    const audio = audioRef.current;
    if (audio) audio.volume = next;
  }

  async function toggle() {
    const audio = audioRef.current;
    if (!audio) return;
    if (on) {
      audio.pause();
      setOn(false);
      return;
    }
    try {
      applyVolume(volume);
      await audio.play();
      setOn(true);
    } catch {
      setOn(false);
    }
  }

  function onVolume(event) {
    const next = Number(event.target.value);
    setVolume(next);
    applyVolume(next);
  }

  const level = Number.isFinite(volume) ? volume : DEFAULT_VOLUME;

  return (
    <div className={on ? "explore-audio is-on" : "explore-audio"}>
      <button
        type="button"
        className={on ? "explore-sound is-on" : "explore-sound"}
        aria-pressed={on}
        onClick={toggle}
      >
        <span className="explore-sound-lamp" aria-hidden="true" />
        {on ? "Engine on" : "Ignition"}
      </button>
      {on ? (
        <label className="explore-volume">
          <span>Vol</span>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={level}
            style={{ "--level": String(level) }}
            aria-label="Background music volume"
            aria-valuetext={`${Math.round(level * 100)} percent`}
            onChange={onVolume}
          />
          <span className="explore-volume-readout" aria-hidden="true">
            {Math.round(level * 100)}
          </span>
        </label>
      ) : null}
      <audio ref={audioRef} src={TRACK} loop preload="none" />
    </div>
  );
}

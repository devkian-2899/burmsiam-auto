"use client";

import { useEffect, useRef, useState } from "react";

export function EngineSound() {
  const nodes = useRef(null);
  const [on, setOn] = useState(false);

  useEffect(() => {
    return () => {
      const current = nodes.current;
      nodes.current = null;
      if (current) current.ctx.close().catch(() => {});
    };
  }, []);

  function ensure() {
    if (nodes.current) return nodes.current;
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioContext();
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);

    const rumble = ctx.createOscillator();
    rumble.type = "sawtooth";
    rumble.frequency.value = 48;
    const lowpass = ctx.createBiquadFilter();
    lowpass.type = "lowpass";
    lowpass.frequency.value = 160;
    const rumbleGain = ctx.createGain();
    rumbleGain.gain.value = 0.2;
    rumble.connect(lowpass);
    lowpass.connect(rumbleGain);
    rumbleGain.connect(master);
    rumble.start();

    const length = ctx.sampleRate * 2;
    const buffer = ctx.createBuffer(1, length, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let index = 0; index < length; index += 1) {
      const white = Math.random() * 2 - 1;
      last = last * 0.985 + white * 0.015;
      data[index] = last;
    }
    const noise = ctx.createBufferSource();
    noise.buffer = buffer;
    noise.loop = true;
    const air = ctx.createBiquadFilter();
    air.type = "bandpass";
    air.frequency.value = 320;
    air.Q.value = 0.5;
    const airGain = ctx.createGain();
    airGain.gain.value = 0.28;
    noise.connect(air);
    air.connect(airGain);
    airGain.connect(master);
    noise.start();

    const idle = ctx.createOscillator();
    idle.frequency.value = 0.4;
    const idleGain = ctx.createGain();
    idleGain.gain.value = 3;
    idle.connect(idleGain);
    idleGain.connect(rumble.frequency);
    idle.start();

    nodes.current = { ctx, master };
    return nodes.current;
  }

  async function toggle() {
    try {
      const { ctx, master } = ensure();
      if (ctx.state === "suspended") await ctx.resume();
      const next = !on;
      const now = ctx.currentTime;
      master.gain.cancelScheduledValues(now);
      master.gain.setValueAtTime(master.gain.value, now);
      master.gain.linearRampToValueAtTime(next ? 0.11 : 0, now + 0.4);
      setOn(next);
    } catch {
      setOn(false);
    }
  }

  return (
    <button
      type="button"
      className={on ? "explore-sound is-on" : "explore-sound"}
      aria-pressed={on}
      onClick={toggle}
    >
      <span className="explore-sound-lamp" aria-hidden="true" />
      {on ? "Engine on" : "Ignition"}
    </button>
  );
}

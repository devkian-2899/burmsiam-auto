"use client";

import { useState } from "react";

export function Photo({ src, srcSet, sizes, alt, className, eager = false }) {
  const [failed, setFailed] = useState(false);
  if (!src || failed) return null;

  return (
    // Drive serves the file to the visitor. The Next.js optimizer cannot fetch it.
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      srcSet={srcSet || undefined}
      sizes={sizes}
      alt={alt}
      className={className}
      loading={eager ? "eager" : "lazy"}
      decoding="async"
      draggable="false"
      onError={() => setFailed(true)}
    />
  );
}

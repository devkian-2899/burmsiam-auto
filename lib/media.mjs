const DRIVE_ID = /^[a-zA-Z0-9_-]{10,}$/;

export function driveId(input) {
  const value = String(input || "").trim();
  if (!value || value.startsWith("data:")) return "";
  if (DRIVE_ID.test(value) && !value.includes(".")) return value;

  try {
    const url = new URL(value);
    const fromQuery = url.searchParams.get("id");
    if (fromQuery) return fromQuery;

    const file = url.pathname.match(/\/file\/d\/([^/]+)/);
    if (file) return file[1];

    const content = url.pathname.match(/\/d\/([^/=]+)/);
    if (content) return content[1];
  } catch {
    return "";
  }

  return "";
}

export function driveSources(input, widths, options = {}) {
  const value = String(input || "").trim();
  if (!value) return { src: "", srcSet: "" };

  const id = driveId(value);
  if (!id) return { src: value, srcSet: "" };

  // -rw asks Drive to keep transparency. Widths of 540 and below can still come back as a black JPEG.
  const suffix = options.alpha ? "-rw" : "";
  const ordered = [...widths].sort((a, b) => a - b);
  const srcSet = ordered
    .map((width) => `https://lh3.googleusercontent.com/d/${id}=w${width}${suffix} ${width}w`)
    .join(", ");

  return {
    src: `https://lh3.googleusercontent.com/d/${id}=w${ordered[ordered.length - 1]}${suffix}`,
    srcSet,
  };
}

export function youtubeId(input) {
  const value = String(input || "").trim();
  if (!value) return "";
  if (/^[\w-]{11}$/.test(value)) return value;

  try {
    const url = new URL(value);
    if (url.hostname.includes("youtu.be")) {
      return url.pathname.split("/").filter(Boolean)[0] || "";
    }
    const watch = url.searchParams.get("v");
    if (watch) return watch;
    const parts = url.pathname.split("/").filter(Boolean);
    const marker = parts.findIndex((part) => part === "embed" || part === "shorts" || part === "live");
    if (marker >= 0 && parts[marker + 1]) return parts[marker + 1];
  } catch {
    return "";
  }

  return "";
}

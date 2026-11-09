export function publicOrigin(request) {
  const configured = process.env.BURMSIAM_PUBLIC_URL?.trim();
  if (configured) {
    try {
      return new URL(configured).origin;
    } catch {
      return "https://www.burmsiamauto.com";
    }
  }
  const host = String(request.headers.get("host") || "").split(",")[0].trim();
  const hostname = host.replace(/:\d+$/, "").toLowerCase();
  if (/^(localhost|127\.0\.0\.1)(:\d+)?$/.test(host)) return `http://${host}`;
  if (hostname === "www.burmsiamauto.com" || hostname === "burmsiamauto.com" || hostname.endsWith(".apps.grok.bot")) {
    return `https://${hostname}`;
  }
  return "https://www.burmsiamauto.com";
}

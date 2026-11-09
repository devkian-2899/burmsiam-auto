import { NextResponse } from "next/server";
import { readEnv } from "./lib/env.mjs";
import { readSession, SESSION_COOKIE } from "./lib/session-cookie.mjs";

function isPanel(pathname) {
  return pathname.startsWith("/admin/visual")
    || pathname.startsWith("/admin/users")
    || pathname.startsWith("/admin/content")
    || pathname.startsWith("/admin/episodes")
    || pathname.startsWith("/api/admin/staff")
    || pathname.startsWith("/api/admin/programs")
    || pathname.startsWith("/api/admin/seasons")
    || pathname.startsWith("/api/admin/episodes")
    || pathname.startsWith("/api/admin/youtube")
    || pathname.startsWith("/api/admin/slides");
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (!isPanel(pathname)) return NextResponse.next();
  const payload = await readSession(
    request.cookies.get(SESSION_COOKIE)?.value,
    readEnv("BURMSIAM_SESSION_SECRET"),
  );
  if (payload) return NextResponse.next();
  if (pathname.startsWith("/api/")) {
    return NextResponse.json({ error: "Sign in first." }, { status: 401 });
  }
  const url = request.nextUrl.clone();
  url.pathname = "/login";
  url.search = "";
  return NextResponse.redirect(url);
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/admin/staff",
    "/api/admin/staff/:path*",
    "/api/admin/programs",
    "/api/admin/programs/:path*",
    "/api/admin/seasons",
    "/api/admin/seasons/:path*",
    "/api/admin/episodes",
    "/api/admin/episodes/:path*",
    "/api/admin/youtube",
    "/api/admin/youtube/:path*",
    "/api/admin/slides",
    "/api/admin/slides/:path*",
  ],
};

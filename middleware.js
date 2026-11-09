import { NextResponse } from "next/server";
import { readSession, SESSION_COOKIE } from "./lib/session-cookie.mjs";

function isPanel(pathname) {
  return pathname.startsWith("/admin/visual")
    || pathname.startsWith("/admin/users")
    || pathname.startsWith("/admin/content")
    || pathname.startsWith("/admin/episodes")
    || pathname.startsWith("/api/admin/staff");
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  if (!isPanel(pathname)) return NextResponse.next();
  const payload = await readSession(
    request.cookies.get(SESSION_COOKIE)?.value,
    process.env.BURMSIAM_SESSION_SECRET?.trim() ?? "",
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
  matcher: ["/admin/:path*", "/api/admin/staff", "/api/admin/staff/:path*"],
};

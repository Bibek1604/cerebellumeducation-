import { NextResponse, type NextRequest } from "next/server";

/**
 * Quick gate for the Admin Panel: without a session cookie, send visitors to
 * the login page. The real check (signature, expiry, account still exists)
 * happens on every admin page and action on the server.
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (pathname === "/admin/login") return NextResponse.next();
  if (!request.cookies.has("cen_admin")) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*"],
};

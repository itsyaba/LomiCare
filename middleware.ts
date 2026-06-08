import { NextRequest, NextResponse } from "next/server";

function hasSessionCookie(request: NextRequest) {
  return Boolean(
    request.cookies.get("better-auth.session_token") ||
      request.cookies.get("__Secure-better-auth.session_token"),
  );
}

export async function middleware(request: NextRequest) {
  const sessionCookie = hasSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Only gate protected routes. Do NOT redirect auth pages based on cookie
  // presence — the cookie may be stale/invalid, and pairing this with a
  // layout redirect (-> /login) causes an infinite middleware loop.
  // Auth pages handle "already signed-in" themselves via getSession().
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/checkin") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/feed") ||
    pathname.startsWith("/profile") ||
    pathname.startsWith("/ritual") ||
    pathname.startsWith("/peace-plan");
  if (!sessionCookie && isProtected) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/checkin/:path*",
    "/chat/:path*",
    "/feed/:path*",
    "/profile/:path*",
    "/ritual/:path*",
    "/peace-plan/:path*",
  ],
};

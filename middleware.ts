import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";
export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;
  if (sessionCookie && ["/login", "/signup", "/register"].includes(pathname)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  const isProtected =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/checkin") ||
    pathname.startsWith("/chat") ||
    pathname.startsWith("/feed") ||
    pathname.startsWith("/profile");
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
    "/login",
    "/signup",
    "/register",
  ],
};

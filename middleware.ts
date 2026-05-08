import { NextRequest, NextResponse } from "next/server";
import { getSessionCookie } from "better-auth/cookies";

export async function middleware(request: NextRequest) {
  const sessionCookie = getSessionCookie(request);
  const { pathname } = request.nextUrl;

  // Redirect authenticated users away from auth pages (except reset-password)
  if (
    sessionCookie &&
    pathname.startsWith("/auth/") &&
    !pathname.startsWith("/auth/reset-password")
  ) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Protect dashboard route - require authentication
  if (!sessionCookie && pathname.startsWith("/dashboard")) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  // Protect my-account routes - require authentication
  if (!sessionCookie && pathname.startsWith("/my-account")) {
    const signInUrl = new URL("/auth/sign-in", request.url);
    signInUrl.searchParams.set("redirect", pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/auth/:path*", "/my-account/:path*"],
};

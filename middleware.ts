import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { AUTH_COOKIE } from "@/lib/auth";

const protectedMatchers = [
  "/dashboard",
  "/report",
  "/products",
  "/products-list",
  "/services",
  "/consumer",
  "/payment-methods",
  "/negotiations",
  "/promotions",
  "/transactions",
  "/invoices",
  "/settings",
  "/preferences",
  "/profile",
  "/feedback",
  "/help",
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = protectedMatchers.some((route) => pathname.startsWith(route));
  const isAuthRoute = pathname.startsWith("/login");
  const isAuthed = request.cookies.get(AUTH_COOKIE)?.value === "true";

  if (!isAuthed && isProtected) {
    const url = new URL("/login", request.url);
    return NextResponse.redirect(url);
  }

  if (isAuthed && isAuthRoute) {
    const url = new URL("/dashboard", request.url);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/",
    "/dashboard/:path*",
    "/report/:path*",
    "/products/:path*",
    "/products-list/:path*",
    "/services/:path*",
    "/consumer/:path*",
    "/payment-methods/:path*",
    "/negotiations/:path*",
    "/promotions/:path*",
    "/transactions/:path*",
    "/invoices/:path*",
    "/settings/:path*",
    "/preferences/:path*",
    "/profile/:path*",
    "/feedback/:path*",
    "/help/:path*",
    "/login",
  ],
};


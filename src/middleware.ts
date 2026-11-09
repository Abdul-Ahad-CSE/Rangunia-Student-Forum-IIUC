import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  const userRole = req.auth?.user?.role;

  const isSuperAdminRoute = nextUrl.pathname.startsWith("/admin/super");
  const isAdminRoute =
    nextUrl.pathname.startsWith("/admin") &&
    !nextUrl.pathname.startsWith("/admin/register");

  // 0. Clean alias: /admin/login -> /login
  if (nextUrl.pathname === "/admin/login") {
    return NextResponse.redirect(new URL("/login", nextUrl));
  }

  // 1. Strict protection for Super Admin panel: strictly SUPER_ADMIN only
  if (isSuperAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(
          "/login?callbackUrl=" + encodeURIComponent(nextUrl.pathname),
          nextUrl
        )
      );
    }
    if (userRole !== "SUPER_ADMIN") {
      // Forbidden: redirect away from super admin panel
      return NextResponse.redirect(new URL("/admin/dashboard", nextUrl));
    }
  }

  // 2. Protection for general admin routes (except public /admin/register)
  if (isAdminRoute) {
    if (!isLoggedIn) {
      return NextResponse.redirect(
        new URL(
          "/login?callbackUrl=" + encodeURIComponent(nextUrl.pathname),
          nextUrl
        )
      );
    }
    if (userRole !== "SUPER_ADMIN" && userRole !== "ADMIN") {
      return NextResponse.redirect(new URL("/dashboard", nextUrl));
    }
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/admin/:path*"],
};

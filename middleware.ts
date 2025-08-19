import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protect admin routes
  if (pathname.startsWith("/admin") && pathname !== "/admin/login") {
    const adminSession = request.cookies.get("admin_session")
    if (!adminSession) {
      return NextResponse.redirect(new URL("/admin/login", request.url))
    }
  }

  // Only protect user profile routes now
  if (pathname.startsWith("/profile")) {
    const userSession = request.cookies.get("user_session")
    if (!userSession) {
      return NextResponse.redirect(new URL("/auth/signin", request.url))
    }
  }

  // Redirect authenticated users away from auth pages
  if (pathname.startsWith("/auth/")) {
    const userSession = request.cookies.get("user_session")
    if (userSession) {
      return NextResponse.redirect(new URL("/", request.url))
    }
  }

  // Redirect authenticated admins away from admin login page
  if (pathname === "/admin/login") {
    const adminSession = request.cookies.get("admin_session")
    if (adminSession) {
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/profile/:path*", "/auth/:path*"],
}

import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = req.nextUrl

  if (
    pathname.startsWith("/api") ||
    pathname.startsWith("/_next") ||
    pathname === "/" ||
    pathname.startsWith("/public") ||
    pathname.includes(".")
  ) {
    return NextResponse.next()
  }

  if (!token) {
    const loginUrl = new URL("/", req.url)
    return NextResponse.redirect(loginUrl)
  }

  if (pathname.startsWith("/admin") && token.role !== "ADMIN") {
    const homeUrl = new URL("/", req.url)
    return NextResponse.redirect(homeUrl)
  }

  if (pathname.startsWith("/cliente") && token.role !== "CLIENT") {
    const homeUrl = new URL("/", req.url)
    return NextResponse.redirect(homeUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/admin/:path*", "/cliente/:path*"],
}

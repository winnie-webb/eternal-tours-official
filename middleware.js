import { NextResponse } from "next/server";
import { verifyAuthToken } from "./lib/authUtils";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect admin routes
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("auth-token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    try {
      await verifyAuthToken(token);
      return NextResponse.next();
    } catch {
      const response = NextResponse.redirect(new URL("/login", request.url));
      response.cookies.delete("auth-token");
      return response;
    }
  }

  // Protect sensitive API routes
  if (
    pathname.startsWith("/api/products") ||
    pathname.startsWith("/api/migrate")
  ) {
    const token =
      request.cookies.get("auth-token")?.value ||
      request.headers.get("authorization")?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    try {
      await verifyAuthToken(token);
      return NextResponse.next();
    } catch {
      return NextResponse.json(
        { error: "Invalid authentication token" },
        { status: 401 }
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/api/products/:path*", "/api/migrate/:path*"],
};

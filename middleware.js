import { NextResponse } from "next/server";
import { verifyAuthToken } from "./lib/authUtils";

// API routes whose reads are public but whose writes need an admin session.
const WRITE_PROTECTED_APIS = ["/api/products", "/api/images", "/api/gallery"];

async function isAuthenticated(request) {
  const token =
    request.cookies.get("auth-token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");
  if (!token) return false;
  try {
    await verifyAuthToken(token);
    return true;
  } catch {
    return false;
  }
}

function unauthorized() {
  return NextResponse.json(
    { error: "Authentication required" },
    { status: 401 }
  );
}

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Protect admin pages
  if (pathname.startsWith("/admin")) {
    if (await isAuthenticated(request)) return NextResponse.next();
    const response = NextResponse.redirect(new URL("/login", request.url));
    response.cookies.delete("auth-token");
    return response;
  }

  // Migration is admin-only for every method
  if (pathname.startsWith("/api/migrate")) {
    return (await isAuthenticated(request)) ? NextResponse.next() : unauthorized();
  }

  // Everyone can read; only admins can write
  if (
    WRITE_PROTECTED_APIS.some((prefix) => pathname.startsWith(prefix)) &&
    request.method !== "GET"
  ) {
    return (await isAuthenticated(request)) ? NextResponse.next() : unauthorized();
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/api/products/:path*",
    "/api/images/:path*",
    "/api/gallery/:path*",
    "/api/migrate/:path*",
  ],
};

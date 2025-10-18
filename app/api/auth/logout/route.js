import { NextResponse } from "next/server";
import { AUTH_COOKIE_CONFIG } from "@/lib/authUtils";

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: "Logged out successfully",
  });

  // Clear the authentication cookie
  response.cookies.set("auth-token", "", {
    ...AUTH_COOKIE_CONFIG,
    maxAge: 0, // Immediately expire the cookie
  });

  return response;
}

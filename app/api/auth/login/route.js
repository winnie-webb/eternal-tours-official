import { NextResponse } from "next/server";
import { adminAuth } from "@/firebaseAdmin";
import { createAuthToken, AUTH_COOKIE_CONFIG } from "@/lib/authUtils";

export async function POST(request) {
  try {
    const { idToken } = await request.json();

    // Validate input
    if (!idToken) {
      return NextResponse.json({ error: "ID token required" }, { status: 400 });
    }

    // Verify Firebase ID token with Firebase Admin
    const decodedToken = await adminAuth.verifyIdToken(idToken);

    // Any Firebase Auth account would otherwise get an admin session. Once
    // ADMIN_EMAILS (comma-separated) is set in Vercel, only those can sign in.
    const allowed = (process.env.ADMIN_EMAILS || "")
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);
    if (allowed.length && !allowed.includes(decodedToken.email?.toLowerCase())) {
      return NextResponse.json({ error: "Not an admin account" }, { status: 403 });
    }

    // Create secure JWT token (4 months expiration)
    const token = await createAuthToken({
      uid: decodedToken.uid,
      email: decodedToken.email,
      role: "admin",
      loginTime: new Date().toISOString(),
    });

    // Create response with secure cookie
    const response = NextResponse.json({
      success: true,
      user: {
        uid: decodedToken.uid,
        email: decodedToken.email,
        message: "Authentication successful - token valid for 4 months",
      },
    });

    response.cookies.set("auth-token", token, AUTH_COOKIE_CONFIG);

    return response;
  } catch (error) {
    console.error("Authentication error:", error);

    // Handle specific Firebase auth errors
    let errorMessage = "Authentication failed";
    if (
      error.code === "auth/user-not-found" ||
      error.code === "auth/wrong-password"
    ) {
      errorMessage = "Invalid email or password";
    } else if (error.code === "auth/too-many-requests") {
      errorMessage = "Too many failed attempts. Please try again later.";
    } else if (error.code === "auth/user-disabled") {
      errorMessage = "This account has been disabled";
    }

    return NextResponse.json({ error: errorMessage }, { status: 401 });
  }
}

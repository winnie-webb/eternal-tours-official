import { cookies } from "next/headers";
import { jwtVerify, SignJWT } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "your-super-secret-key-change-this-in-production"
);

export async function createAuthToken(userData) {
  return await new SignJWT(userData)
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("120d") // 4 months expiration (120 days)
    .setIssuedAt()
    .sign(JWT_SECRET);
}

export async function verifyAuthToken(token) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (error) {
    throw new Error("Invalid token");
  }
}

export async function getAuthUser() {
  const cookieStore = cookies();
  const token = cookieStore.get("auth-token")?.value;

  if (!token) {
    return null;
  }

  try {
    return await verifyAuthToken(token);
  } catch {
    return null;
  }
}

export const AUTH_COOKIE_CONFIG = {
  httpOnly: true, // Cannot be accessed via JavaScript
  secure: process.env.NODE_ENV === "production", // HTTPS only in production
  sameSite: "strict", // CSRF protection
  maxAge: 4 * 30 * 24 * 60 * 60, // 4 months in seconds (approximately)
  path: "/", // Available site-wide
};

import { NextResponse } from "next/server";
import { getAuthUser } from "@/lib/authUtils";

export async function GET() {
  try {
    const user = await getAuthUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    return NextResponse.json({
      authenticated: true,
      user: {
        uid: user.uid,
        email: user.email,
        role: user.role,
        loginTime: user.loginTime,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Authentication verification failed" },
      { status: 401 }
    );
  }
}

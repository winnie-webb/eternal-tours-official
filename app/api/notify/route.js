import admin from "@/firebaseAdmin"; // Adjust path to your firebaseAdmin.js file
import { NextResponse } from "next/server";

// Named export for the POST method
export async function POST(req) {
  try {
    const body = await req.json();

    // Assuming you're sending notifications with Firebase Admin SDK
    const message = {
      notification: {
        title: body.title,
        body: body.body,
      },
      token: body.token, // The user's FCM token
    };
    // Send notification using Firebase Admin SDK
    await admin.messaging().send(message);

    return NextResponse.json({ success: true, message: "Notification sent!" });
  } catch (error) {
    console.error("Error sending notification:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

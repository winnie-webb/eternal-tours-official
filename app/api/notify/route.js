import admin from "@/firebaseAdmin"; // Adjust path to your firebaseAdmin.js file
import { NextResponse } from "next/server";

// Named export for the POST method
export async function POST(req) {
  try {
    const body = await req.json();
    console.log(body);

    // Create an array of promises for each token
    const sendNotifications = body.tokens.map(async (token) => {
      const message = {
        notification: {
          title: body.title,
          body: body.body,
        },
        token: token, // The user's FCM token
      };

      // Send the message and return the response
      return await admin.messaging().send(message);
    });

    // Wait for all notifications to be sent
    const results = await Promise.all(sendNotifications);
    console.log("All notifications sent:", results);

    return NextResponse.json({ success: true, message: "Notifications sent!" });
  } catch (error) {
    console.error("Error sending notification:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

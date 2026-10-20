import admin from "@/firebaseAdmin";
import { NextResponse } from "next/server";

// Called by the booking forms after a booking is saved. Tokens and wording
// are decided here, not by the caller, so this can't be used to push
// arbitrary messages to admin devices.
export async function POST() {
  try {
    const snapshot = await admin.firestore().collection("users").get();
    const tokens = snapshot.docs.flatMap((doc) =>
      Array.isArray(doc.data().tokens) ? doc.data().tokens : []
    );
    if (tokens.length === 0) {
      return NextResponse.json({ success: true, sent: 0 });
    }

    const result = await admin.messaging().sendEachForMulticast({
      notification: {
        title: "New Booking Alert!",
        body: "Please check the admin panel.",
      },
      tokens,
    });

    return NextResponse.json({ success: true, sent: result.successCount });
  } catch (error) {
    console.error("Error sending notification:", error.message);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

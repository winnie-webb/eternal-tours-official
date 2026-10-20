import admin from "../../../../firebaseAdmin";
import { NextResponse } from "next/server";

const db = admin.firestore();

// Image ids are random and never reused, so the bytes behind a url never
// change and can be cached forever.
export async function GET(request, { params }) {
  try {
    const doc = await db.collection("images").doc(params.id).get();
    if (!doc.exists) {
      return NextResponse.json({ error: "Image not found" }, { status: 404 });
    }
    const { contentType, data } = doc.data();
    return new Response(Buffer.from(data, "base64"), {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch (error) {
    console.error("Error reading image:", error);
    return NextResponse.json({ error: "Failed to read image" }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await db.collection("images").doc(params.id).delete();
    return NextResponse.json({ message: "Image deleted" }, { status: 200 });
  } catch (error) {
    console.error("Error deleting image:", error);
    return NextResponse.json(
      { error: "Failed to delete image" },
      { status: 500 }
    );
  }
}

import admin from "../../../firebaseAdmin";
import { NextResponse } from "next/server";

const db = admin.firestore();

// Firebase Storage isn't enabled on this project (it needs the Blaze plan),
// and Vercel's filesystem is read-only, so uploaded images are stored in
// Firestore. The admin compresses them in the browser first; a document
// tops out at 1 MiB, which leaves room for ~700 KB of image.
const MAX_BYTES = 700 * 1024;
const ALLOWED_TYPES = ["image/webp", "image/jpeg", "image/png"];

// POST { dataUrl } -> { url }   (write routes are auth-gated in middleware)
export async function POST(request) {
  try {
    const { dataUrl } = await request.json();
    const match = /^data:([\w/+.-]+);base64,(.+)$/.exec(dataUrl || "");
    if (!match || !ALLOWED_TYPES.includes(match[1])) {
      return NextResponse.json(
        { error: "Send a webp, jpeg or png image as a data URL" },
        { status: 400 }
      );
    }

    const [, contentType, data] = match;
    const bytes = Buffer.byteLength(data, "base64");
    if (bytes > MAX_BYTES) {
      return NextResponse.json(
        { error: `Image is ${Math.round(bytes / 1024)} KB; the limit is 700 KB` },
        { status: 413 }
      );
    }

    const ref = db.collection("images").doc();
    await ref.set({
      contentType,
      data,
      bytes,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return NextResponse.json({ url: `/api/images/${ref.id}` }, { status: 201 });
  } catch (error) {
    console.error("Error storing image:", error);
    return NextResponse.json(
      { error: "Failed to store image" },
      { status: 500 }
    );
  }
}

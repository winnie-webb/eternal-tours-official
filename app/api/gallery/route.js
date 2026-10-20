import admin from "../../../firebaseAdmin";
import { NextResponse } from "next/server";

const db = admin.firestore();

// GET -> [{ id, url }]   uploaded photos, newest first. The eight photos that
// ship with the site (/public/local) are added by the Gallery component.
export async function GET() {
  try {
    const snapshot = await db
      .collection("gallery")
      .orderBy("createdAt", "desc")
      .get();
    const uploaded = snapshot.docs.map((doc) => ({
      id: doc.id,
      url: doc.data().url,
    }));
    return NextResponse.json(uploaded, { status: 200 });
  } catch (error) {
    console.error("Error fetching gallery images:", error);
    return NextResponse.json(
      { error: "Error fetching gallery images" },
      { status: 500 }
    );
  }
}

// POST { url } — url comes from /api/images   (auth-gated in middleware)
export async function POST(request) {
  try {
    const { url } = await request.json();
    if (!url?.startsWith("/api/images/")) {
      return NextResponse.json(
        { error: "Upload the image to /api/images first" },
        { status: 400 }
      );
    }
    const ref = await db.collection("gallery").add({
      url,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });
    return NextResponse.json({ id: ref.id, url }, { status: 201 });
  } catch (error) {
    console.error("Error adding gallery image:", error);
    return NextResponse.json(
      { error: "Failed to add gallery image" },
      { status: 500 }
    );
  }
}

// DELETE ?id=<gallery doc id>   (auth-gated in middleware)
export async function DELETE(request) {
  try {
    const id = new URL(request.url).searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const ref = db.collection("gallery").doc(id);
    const doc = await ref.get();
    if (doc.exists) {
      const imageId = doc.data().url?.split("/api/images/")[1];
      if (imageId) await db.collection("images").doc(imageId).delete();
      await ref.delete();
    }
    return NextResponse.json({ message: "Removed" }, { status: 200 });
  } catch (error) {
    console.error("Error removing gallery image:", error);
    return NextResponse.json(
      { error: "Failed to remove gallery image" },
      { status: 500 }
    );
  }
}

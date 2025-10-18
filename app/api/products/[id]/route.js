import admin from "../../../../firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

const db = admin.firestore();

// GET single product by ID
export async function GET(request, { params }) {
  try {
    const { id } = params;

    const productDoc = await db.collection("products").doc(id).get();

    if (!productDoc.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    const product = {
      id: productDoc.id,
      ...productDoc.data(),
    };

    return NextResponse.json(product, { status: 200 });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      { error: "Failed to fetch product" },
      { status: 500 }
    );
  }
}

// PUT - Update product by ID
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Check if product exists
    const productDoc = await db.collection("products").doc(id).get();
    if (!productDoc.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Update the product with timestamp
    const updateData = {
      ...body,
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
    };

    await db.collection("products").doc(id).update(updateData);

    return NextResponse.json(
      {
        message: "Product updated successfully",
        product: { id, ...updateData },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { error: "Failed to update product" },
      { status: 500 }
    );
  }
}

// DELETE - Delete product by ID
export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    // Check if product exists
    const productDoc = await db.collection("products").doc(id).get();
    if (!productDoc.exists) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    // Delete the product
    await db.collection("products").doc(id).delete();

    return NextResponse.json(
      { message: "Product deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product:", error);
    return NextResponse.json(
      { error: "Failed to delete product" },
      { status: 500 }
    );
  }
}

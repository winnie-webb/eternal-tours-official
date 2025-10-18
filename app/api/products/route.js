import admin from "../../../firebaseAdmin";
import { NextRequest, NextResponse } from "next/server";

const db = admin.firestore();

// GET all products
export async function GET() {
  try {
    const productsRef = db.collection("products");
    const snapshot = await productsRef.get();

    const products = [];
    snapshot.forEach((doc) => {
      products.push({
        id: doc.id,
        ...doc.data(),
      });
    });

    return NextResponse.json(products, { status: 200 });
  } catch (error) {
    console.error("Error fetching products:", error);
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    );
  }
}

// POST - Create new product
export async function POST(request) {
  try {
    const body = await request.json();

    // Validate required fields
    const { id, title, category, priceLowest, priceHighest, imageExtension } =
      body;

    if (!id || !title || !category || !priceLowest || !priceHighest) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: id, title, category, priceLowest, priceHighest",
        },
        { status: 400 }
      );
    }

    // Check if product with this ID already exists
    const existingProduct = await db.collection("products").doc(id).get();
    if (existingProduct.exists) {
      return NextResponse.json(
        { error: "Product with this ID already exists" },
        { status: 409 }
      );
    }

    // Create the product document
    await db
      .collection("products")
      .doc(id)
      .set({
        ...body,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });

    return NextResponse.json(
      { message: "Product created successfully", product: { id, ...body } },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating product:", error);
    return NextResponse.json(
      { error: "Failed to create product" },
      { status: 500 }
    );
  }
}

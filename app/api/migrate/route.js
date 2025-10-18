import admin from "../../../firebaseAdmin";
import { NextResponse } from "next/server";
import products from "../../data/products.json";

const db = admin.firestore();

// POST - Migrate products from JSON to Firestore
export async function POST() {
  try {
    const batch = db.batch();
    let migrationCount = 0;

    // Check if products already exist in Firestore
    const existingProductsSnapshot = await db.collection("products").get();
    if (!existingProductsSnapshot.empty) {
      return NextResponse.json(
        {
          error:
            "Products already exist in Firestore. Use DELETE first if you want to re-migrate.",
          existingCount: existingProductsSnapshot.size,
        },
        { status: 409 }
      );
    }

    // Add each product to the batch
    for (const product of products) {
      const productRef = db.collection("products").doc(product.id);
      batch.set(productRef, {
        ...product,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
      migrationCount++;
    }

    // Commit the batch
    await batch.commit();

    return NextResponse.json(
      {
        message: "Products migrated successfully",
        migratedCount: migrationCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error migrating products:", error);
    return NextResponse.json(
      { error: "Failed to migrate products", details: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Clear all products from Firestore (for testing purposes)
export async function DELETE() {
  try {
    const snapshot = await db.collection("products").get();
    const batch = db.batch();
    let deletionCount = 0;

    snapshot.forEach((doc) => {
      batch.delete(doc.ref);
      deletionCount++;
    });

    await batch.commit();

    return NextResponse.json(
      {
        message: "All products deleted successfully",
        deletedCount: deletionCount,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting products:", error);
    return NextResponse.json(
      { error: "Failed to delete products", details: error.message },
      { status: 500 }
    );
  }
}

// GET - Check migration status
export async function GET() {
  try {
    const snapshot = await db.collection("products").get();
    const jsonProductsCount = products.length;
    const firestoreProductsCount = snapshot.size;

    return NextResponse.json({
      jsonProductsCount,
      firestoreProductsCount,
      migrationNeeded: firestoreProductsCount === 0,
      allMigrated: jsonProductsCount === firestoreProductsCount,
    });
  } catch (error) {
    console.error("Error checking migration status:", error);
    return NextResponse.json(
      { error: "Failed to check migration status" },
      { status: 500 }
    );
  }
}

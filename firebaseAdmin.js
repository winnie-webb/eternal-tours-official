import admin from "firebase-admin";

// Parse the service account JSON from the environment variable
let serviceAccount;

try {
  const serviceAccountKey =
    process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY;

  if (!serviceAccountKey) {
    throw new Error(
      "NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY environment variable is not set"
    );
  }

  // Remove any leading/trailing whitespace and ensure it's valid JSON
  const cleanedKey = serviceAccountKey.trim();
  serviceAccount = JSON.parse(cleanedKey);

  // Fix the private key formatting
  if (serviceAccount.private_key) {
    serviceAccount.private_key = serviceAccount.private_key.replace(
      /\\n/g,
      "\n"
    );
  }
} catch (error) {
  console.error("Error parsing Firebase service account key:", error.message);
  throw new Error(
    `Invalid Firebase service account configuration: ${error.message}`
  );
}

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log("Firebase Admin initialized successfully");
  } catch (error) {
    console.error("Error initializing Firebase Admin:", error.message);
    throw error;
  }
}

// Export the admin instance and auth service
export default admin;
export const adminAuth = admin.auth();
export const adminDb = admin.firestore();

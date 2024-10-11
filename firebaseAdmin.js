import admin from "firebase-admin";

// Parse the service account JSON from the environment variable
const serviceAccount = JSON.parse(
  process.env.NEXT_PUBLIC_FIREBASE_SERVICE_ACCOUNT_KEY
);

serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

export default admin;

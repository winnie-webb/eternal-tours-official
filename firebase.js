import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getMessaging, getToken, onMessage } from "firebase/messaging";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

let messaging;
try {
  if (typeof window !== "undefined") {
    messaging = getMessaging(app);
  }
} catch (e) {
  console.log("Service Worker issues");
}

// Save admin token in Firestore
export const saveAdminToken = async (token) => {
  const adminRef = doc(db, "users", "AvUZdeyakW6hyU3TYi0H"); // Use your admin user ID
  await setDoc(adminRef, { token: token }, { merge: true });
};

// Retrieve admin token from Firestore
export const getAdminToken = async () => {
  const adminRef = doc(db, "users", "AvUZdeyakW6hyU3TYi0H"); // Use your admin user ID
  const adminDoc = await getDoc(adminRef);
  return adminDoc.exists() ? adminDoc.data().token : null;
};

export const registerServiceWorker = async () => {
  if (typeof window !== "undefined" && "serviceWorker" in navigator) {
    try {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      console.log("Service Worker registered successfully:", registration);

      await navigator.serviceWorker.ready;

      return registration;
    } catch (error) {
      console.error("Service Worker registration failed:", error);
      throw error;
    }
  }
};

export const requestPermission = async () => {
  if (typeof window !== "undefined") {
    console.log("Requesting permission...");
    try {
      const registration = await registerServiceWorker();
      const currentToken = await getToken(messaging, {
        vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
        serviceWorkerRegistration: registration,
      });

      if (currentToken) {
        await saveAdminToken(currentToken); // Save the token for the admin
        return currentToken;
      } else {
        console.warn(
          "No registration token available. Request permission to generate one."
        );
      }
    } catch (error) {
      console.error("An error occurred while retrieving token.", error);
    }
  }
};

export { db, auth, messaging, getMessaging, getToken, onMessage };

import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocs,
  collection,
  arrayUnion,
} from "firebase/firestore";
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
if (typeof window !== "undefined") {
  messaging = getMessaging(app);
}

export const saveAdminToken = async (user, token) => {
  if (user && token) {
    const adminRef = doc(db, "users", user.uid);
    await setDoc(adminRef, { tokens: arrayUnion(token) }, { merge: true }); // Add the token without overwriting
  }
};

// Retrieve admin token from Firestore
export const getAllAdminTokens = async () => {
  const tokens = [];
  const usersCollection = collection(db, "users");
  const snapshot = await getDocs(usersCollection);

  snapshot.forEach((doc) => {
    const userData = doc.data();
    if (userData.tokens && Array.isArray(userData.tokens)) {
      tokens.push(...userData.tokens); // Spread the tokens to merge into a single array
    }
  });

  return tokens;
};

// Register service worker and request notification permission
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
      // Step 1: Register the service worker
      const registration = await registerServiceWorker();

      // Step 2: Check and request notification permission
      const permission = Notification.permission;
      if (permission === "default") {
        await Notification.requestPermission();
      }

      if (permission === "granted" || Notification.permission === "granted") {
        console.log("Notification permission granted.");

        // Step 3: Get FCM token
        const currentToken = await getToken(messaging, {
          vapidKey: process.env.NEXT_PUBLIC_VAPID_KEY,
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          console.log("FCM Token retrieved:", currentToken);
          return currentToken; // Return the token instead of logging undefined
        } else {
          console.warn("No registration token available.");
        }
      } else {
        console.warn("Notification permission denied.");
      }
    } catch (error) {
      console.error("Error retrieving token:", error);
    }
  }
};

export { db, auth, messaging, getMessaging, getToken, onMessage };

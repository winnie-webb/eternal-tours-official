// Instead of import statements, use importScripts for loading external scripts.
importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
importScripts(
  "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
);

// Initialize Firebase in the Service Worker.
firebase.initializeApp({
  apiKey: "AIzaSyAx_EeeHlW_9aLCc29J1_GoTKs-bNb6nd8",
  authDomain: "jett-1991e.firebaseapp.com",
  projectId: "jett-1991e",
  storageBucket: "jett-1991e.appspot.com",
  messagingSenderId: "970573532400",
  appId: "1:970573532400:web:8552984a536b0bd6b98635",
  messagingSenderId: "970573532400",
});

// Retrieve Firebase Messaging object.
const messaging = firebase.messaging();

// Handle background messages.
messaging.onBackgroundMessage((payload) => {
  // Customize the notification.
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: "/firebase-logo.png",
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});

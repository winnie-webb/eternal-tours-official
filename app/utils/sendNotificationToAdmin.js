import { getAdminToken } from "@/firebase";

// sendNotificationToAdmin.js
const sendNotificationToAdmin = async () => {
  try {
    const response = await fetch("/api/notify", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: "New booking Alert!!",
        body: "Please check the admin panel",
        token: await getAdminToken(), // Get the admin's FCM token from Firestore
      }),
    });

    const data = await response.json();

    if (data.success) {
      console.log("Notification sent to admin:");
    } else {
      console.error("Failed to send notification:", data.error);
    }
  } catch (error) {
    console.error("Error sending notification to admin:", error);
  }
};
export default sendNotificationToAdmin;

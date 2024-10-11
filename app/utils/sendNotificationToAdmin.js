import { getAllAdminTokens } from "@/firebase";

// Function to send notifications to all admins
const sendNotificationToAdmin = async () => {
  try {
    const tokens = await getAllAdminTokens(); // Get all stored tokens

    const response = await fetch("/api/notify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: "New Booking Alert!",
        body: "Please check the admin panel.",
        tokens: tokens, // Send to all tokens
      }),
    });

    console.log("Notification response:", response);
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

export default sendNotificationToAdmin;

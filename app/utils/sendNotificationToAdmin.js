// Tell every admin device a booking came in; the server picks the recipients.
const sendNotificationToAdmin = async () => {
  try {
    await fetch("/api/notify", { method: "POST" });
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};

export default sendNotificationToAdmin;

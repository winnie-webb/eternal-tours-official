import { useEffect } from "react";
import {
  requestPermission,
  registerServiceWorker,
  messaging,
  onMessage,
} from "@/firebase"; // Adjust the path to your firebase.js file

const Notifications = () => {
  useEffect(() => {
    const setupNotifications = async () => {
      await registerServiceWorker();
      await requestPermission();
    };

    setupNotifications();
  }, []);
  useEffect(() => {
    if (messaging) {
      onMessage(messaging, (payload) => {
        console.log("Foreground message received: ", payload);
        const { title, body } = payload.notification;

        if (Notification.permission === "granted") {
          new Notification(title, {
            body: body,
          });
        }
      });
    }
  }, []);

  return <div>Notifications Setup</div>;
};

export default Notifications;

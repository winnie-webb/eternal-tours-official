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
      // await requestPermission();
    };

    setupNotifications();
  }, []);

  return <div>Notifications Setup</div>;
};

export default Notifications;

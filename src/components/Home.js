import { useEffect, useState } from "react";

const Home = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const checkInternetConnection = async () => {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 3000);

        const response = await fetch("https://www.google.com/generate_204", {
          method: "GET",
          mode: "no-cors",
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok || response.status === 0) {
          setIsOnline(true);
        } else {
          setIsOnline(false);
        }
      } catch (error) {
        setIsOnline(false);
      }
    };

    const updateOnlineStatus = () => {
      if (navigator.onLine) {
        checkInternetConnection();
      } else {
        setIsOnline(false);
      }
    };

    const intervalId = setInterval(updateOnlineStatus, 5000);

    window.addEventListener("online", updateOnlineStatus);
    window.addEventListener("offline", updateOnlineStatus);

    updateOnlineStatus();

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("online", updateOnlineStatus);
      window.removeEventListener("offline", updateOnlineStatus);
    };
  }, []);

  return (
    <>
      <h2>{isOnline ? "You are online" : "You are offline"}</h2>
    </>
  );
};

export default Home;

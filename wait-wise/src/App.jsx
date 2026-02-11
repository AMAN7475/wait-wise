import { useState, useEffect } from "react";
import "./App.css"
import UserScreen from "./components/UserScreen.jsx";
import AdminScreen from "./components/AdminScreen.jsx";
import WaitingScreen from "./components/WaitingScreen.jsx";

function App() {
  const [screen, setScreen] = useState("user");

  const SERVICE_TIME = 2 * 60 * 1000; // 2 minutes
  const [serviceStartTime, setServiceStartTime] = useState(Date.now());

  const [queue, setQueue] = useState(
    JSON.parse(localStorage.getItem("queueData")) || []
  );

  const [tokenCounter, setTokenCounter] = useState(
    parseInt(localStorage.getItem("tokenCounter")) || 1
  );

  useEffect(() => {
    localStorage.setItem("queueData", JSON.stringify(queue));
    localStorage.setItem("tokenCounter", tokenCounter);
  }, [queue, tokenCounter]);

  useEffect(() => {

    // If no patients are in queue, no timer is needed
    if (queue.length === 0) return;

    // Timer runs every 1 second
    const interval = setInterval(() => {
      const now = Date.now(); // current time

      // Check if service time is over
      if (now - serviceStartTime >= SERVICE_TIME) {

        // Remove the current patient from queue
        setQueue(prevQueue => {

          // If only one or no patient is left, clear queue
          if (prevQueue.length <= 1) return [];

          // Otherwise remove the first patient only
          return prevQueue.slice(1);
        });

        // Start service time for next patient
        setServiceStartTime(Date.now());
      }

    }, 1000);

    // Cleanup: stop old timer before starting a new one
    return () => clearInterval(interval);

  }, [queue.length, serviceStartTime]);

  return (
    <div className="App">
      <h1>WAIT-WISE</h1>
      <h2>A Smart Queue Management System For Doctor Clinics</h2>

      <div className="switch-buttons">
        <button onClick={() => setScreen("user")}>Patient Screen</button>
        <button onClick={() => setScreen("admin")}>Admin Screen</button>
        <button onClick={() => setScreen("waiting")}>Waiting Screen</button>
      </div>

      <hr />

      {/* Show Patient screen */}
      {screen === "user" && (
        <UserScreen
          queue={queue}
          setQueue={setQueue}
          tokenCounter={tokenCounter}
          setTokenCounter={setTokenCounter}
        />
      )}

    </div>
  );   
}

export default App;
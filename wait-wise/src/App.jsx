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
    if (queue.length === 0) return;

    const interval = setInterval(() => {
      const now = Date.now();

      if (now - serviceStartTime >= SERVICE_TIME) {
        setQueue(prevQueue => {
          if (prevQueue.length <= 1) return [];
          return prevQueue.slice(1);
        });

        setServiceStartTime(Date.now());
      }
    }, 1000);

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

      {screen === "admin" && (
        <AdminScreen
          queue={queue}
          setQueue={setQueue}
          setTokenCounter={setTokenCounter}
          setServiceStartTime={setServiceStartTime}
        />    
      )} 

      {screen === "waiting" && (
        <WaitingScreen
          queue={queue}
          serviceStartTime={serviceStartTime}
        />
      )}

    </div>
  );   
}

export default App;
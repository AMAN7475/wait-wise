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


  return (
    <div className="App">
      <h1>WAIT-WISE</h1>
      <h2>A Smart Queue Management System For Doctor Clinics</h2>

      <div className="switch-buttons">
        <button onClick={() => setScreen("user")}>Patient Screen</button>
        <button onClick={() => setScreen("admin")}>Admin Screen</button>
        <button onClick={() => setScreen("waiting")}>Waiting Screen</button>
      </div>
    </div>
  )   
}
import { useState, useEffect } from "react";
import "./App.css"
import UserScreen from "./components/UserScreen.jsx";
import AdminScreen from "./components/AdminScreen.jsx";
import WaitingScreen from "./components/WaitingScreen.jsx";

function App() {
  const [screen, setScreen] = useState("user");

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
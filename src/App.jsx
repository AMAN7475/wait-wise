import { useState, useEffect } from "react";
import { Routes, Route, Link } from "react-router-dom";
import "./App.css"
import UserScreen from "./components/UserScreen.jsx";
import AdminScreen from "./components/AdminScreen.jsx";
import WaitingScreen from "./components/WaitingScreen.jsx";

function App() {
  return (
    <div className="App">
      <h1>WAIT-WISE</h1>
      <h2>A Smart Queue Management System For Doctor Clinics</h2>

      <div className="switch-buttons">
        {/*
          <Link> works like a normal <a> tag, but changes the URL
          without reloading the whole page -- React Router intercepts
          the click and swaps the matching <Route> component instantly.
        */}
        <Link to="/"><button>Patient Screen</button></Link>
        <Link to="/admin"><button>Admin Screen</button></Link>
      </div>

      <hr />

      {/*
        Routes define which component shows for which URL.
        Instead of one shared "screen" state deciding what everyone
        sees, each URL now independently determines its own view --
        this is what allows two different patients (or the admin) to
        have completely different, simultaneously valid screens open.
      */}
      <Routes>
        <Route path="/" element={<UserScreen />} />

        {/*
          ":tokenNumber" is a URL parameter -- a placeholder that
          matches whatever real token number is in the URL, e.g.
          /waiting/6 or /waiting/9. WaitingScreen reads this value
          using useParams() in Phase 6b.
        */}
        <Route path="/waiting/:tokenNumber" element={<WaitingScreen />} />

        <Route path="/admin" element={<AdminScreen />} />
      </Routes>

    </div>
  );
}

export default App;
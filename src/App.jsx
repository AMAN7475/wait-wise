import { Routes, Route, Link } from "react-router-dom";
import "./App.css";
import UserScreen from "./components/UserScreen.jsx";
import AdminScreen from "./components/AdminScreen.jsx";
import WaitingScreen from "./components/WaitingScreen.jsx";

function App() {
  return (
    <div className="App">
      <div className="app-header">
        <h1>WaitWise</h1>
        <p>Smart queue management for clinics</p>
      </div>

      <div className="switch-buttons">
        <Link to="/"><button>Patient Screen</button></Link>
        <Link to="/admin"><button>Admin Screen</button></Link>
      </div>

      <Routes>
        <Route path="/" element={<UserScreen />} />
        <Route path="/waiting/:tokenNumber" element={<WaitingScreen />} />
        <Route path="/admin" element={<AdminScreen />} />
      </Routes>
    </div>
  );
}

export default App;
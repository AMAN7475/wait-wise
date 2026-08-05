import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientPosition } from "../api.js";
import { socket } from "../socket.js";
import "./Waiting.css";

function WaitingScreen() {
    // Reads the dynamic part of the URL. For a URL like
    // /waiting/6, tokenNumber will be the string "6".
    const { tokenNumber } = useParams();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // Fetches this patient's current position from the backend.
    // Called once when the page loads, and again every time we
    // hear a "queueUpdated" event from the server.
    const fetchPosition = async () => {
        try {
            const data = await getPatientPosition(tokenNumber);
            setPatient(data);
            setError("");
        } catch (err) {
            setError("Could not find this token. Please check your link.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosition();

        // Whenever the admin extends someone's time or removes a
        // patient, the backend broadcasts "queueUpdated" to every
        // connected browser. Here, we react to that by re-fetching
        // this specific patient's position -- so the screen updates
        // live, without the user ever refreshing the page.
        socket.on("queueUpdated", fetchPosition);

        // Cleanup: when this component unmounts (e.g. user navigates
        // away), stop listening -- otherwise old listeners can pile
        // up and cause duplicate fetches.
        return () => {
            socket.off("queueUpdated", fetchPosition);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenNumber]);

    if (loading) {
        return (
            <div className="waiting-container">
                <p>Loading your position...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="waiting-container">
                <p style={{ color: "red" }}>{error}</p>
            </div>
        );
    }

    return (
        <div className="waiting-container">
            <h2 className="sub-heading">YOUR TOKEN: {patient.token_number}</h2>
            <p>Name: {patient.name}</p>
            <p>Status: {patient.status}</p>

            {patient.status === "waiting" ? (
                <>
                    <p className="eta">
                        Patients ahead of you:
                        <span className="time-value">{patient.patients_ahead}</span>
                    </p>
                    <p className="eta">
                        Estimated wait:
                        <span className="time-value">
                            {patient.estimated_wait_minutes} min
                        </span>
                    </p>
                </>
            ) : (
                <p>Your status has changed -- please check with the front desk.</p>
            )}
        </div>
    );
}

export default WaitingScreen;
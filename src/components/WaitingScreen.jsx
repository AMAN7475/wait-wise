import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientPosition } from "../api.js";
import { socket } from "../socket.js";
// import "./WaitingScreen.css";

function WaitingScreen() {
    const { tokenNumber } = useParams();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

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
        socket.on("queueUpdated", fetchPosition);
        return () => {
            socket.off("queueUpdated", fetchPosition);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [tokenNumber]);

    if (loading) {
        return (
            <div className="waiting-card">
                <p className="loading-text">Loading your position...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="waiting-card">
                <p className="field-error">{error}</p>
            </div>
        );
    }

    const statusLabel = {
        waiting: "Waiting",
        in_consultation: "In consultation",
        done: "Completed",
        removed: "Removed",
    }[patient.status];

    return (
        <div className="waiting-card">
            <div className="token-panel">
                <div className="live-indicator">
                    <span className="live-dot" />
                    LIVE
                </div>
                <p className="token-label">Your token</p>
                <p className="token-number">{String(patient.token_number).padStart(3, "0")}</p>
            </div>

            <div className="patient-meta">
                <p className="patient-name">{patient.name}</p>
                <span className={`status-badge status-${patient.status}`}>
                    {statusLabel}
                </span>
            </div>

            {patient.status === "waiting" ? (
                <div className="stats-row">
                    <div className="stat">
                        <p className="stat-value">{patient.patients_ahead}</p>
                        <p className="stat-label">Patients ahead</p>
                    </div>
                    <div className="stat">
                        <p className="stat-value">{patient.estimated_wait_minutes}<span className="stat-unit"> min</span></p>
                        <p className="stat-label">Estimated wait</p>
                    </div>
                </div>
            ) : (
                <p className="waiting-message">
                    Your status has changed — please check with the front desk.
                </p>
            )}
        </div>
    );
}

export default WaitingScreen;
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPatientPosition } from "../api.js";
import { socket } from "../socket.js";
import "./WaitingScreen.css";

function WaitingScreen() {
    const { tokenNumber } = useParams();

    const [patient, setPatient] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [lastUpdated, setLastUpdated] = useState(null);

    const fetchPosition = async () => {
        try {
            const data = await getPatientPosition(tokenNumber);
            setPatient(data);
            setError("");
            setLastUpdated(new Date());
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

    const isYourTurn = patient.status === "waiting" && patient.patients_ahead === 0;

    return (
        <div className="waiting-card">
            <div className="card-top">
                <span className="token-chip">Token #{String(patient.token_number).padStart(3, "0")}</span>
                <div className="live-indicator">
                    <span className="live-dot" />
                    LIVE
                </div>
            </div>

            {patient.status === "waiting" ? (
                <>
                    <div className="hero">
                        {isYourTurn ? (
                            <>
                                <p className="hero-headline turn">You're next</p>
                                <p className="hero-subtext">Please be ready — the clinic will call you shortly</p>
                            </>
                        ) : (
                            <>
                                <p className="hero-eyebrow">You're next in</p>
                                <p className="hero-headline">
                                    {patient.estimated_wait_minutes}
                                    <span className="hero-unit">
                                        {" "}min{patient.estimated_wait_minutes === 1 ? "" : "s"}
                                    </span>
                                </p>
                                <p className="hero-subtext">
                                    {patient.patients_ahead} patient{patient.patients_ahead === 1 ? "" : "s"} ahead of you
                                </p>
                            </>
                        )}
                    </div>

                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{
                                width: isYourTurn
                                    ? "100%"
                                    : `${Math.max(8, 100 - patient.patients_ahead * 15)}%`,
                            }}
                        />
                    </div>
                </>
            ) : (
                <div className="hero">
                    <p className="hero-headline status-only">{statusLabel}</p>
                    <p className="hero-subtext">
                        Your status has changed — please check with the front desk.
                    </p>
                </div>
            )}

            <div className="patient-row">
                <span className="patient-name">{patient.name}</span>
                <span className={`status-badge status-${patient.status}`}>{statusLabel}</span>
            </div>

            {lastUpdated && (
                <p className="last-updated">
                    Updated {lastUpdated.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
            )}
        </div>
    );
}

export default WaitingScreen;
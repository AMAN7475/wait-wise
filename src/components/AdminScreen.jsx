import { useEffect, useState } from "react";
import { getAllPatients, extendPatientTime, removePatient } from "../api.js";
import { socket } from "../socket.js";
// import "./AdminScreen.css";

function AdminScreen() {
    const [patients, setPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchPatients = async () => {
        try {
            const data = await getAllPatients();
            setPatients(data.patients);
        } catch (err) {
            console.error("Failed to load patients", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPatients();
        socket.on("queueUpdated", fetchPatients);
        return () => {
            socket.off("queueUpdated", fetchPatients);
        };
    }, []);

    const handleExtend = async (id) => {
        try {
            await extendPatientTime(id);
        } catch (err) {
            alert("Could not extend time. Please try again.");
        }
    };

    const handleRemove = async (id) => {
        if (!window.confirm("Remove this patient from the queue?")) return;
        try {
            await removePatient(id);
        } catch (err) {
            alert("Could not remove patient. Please try again.");
        }
    };

    if (loading) {
        return (
            <div className="admin-card">
                <p className="loading-text">Loading patients...</p>
            </div>
        );
    }

    const statusLabel = {
        waiting: "Waiting",
        in_consultation: "In consultation",
        done: "Completed",
        removed: "Removed",
    };

    const waitingCount = patients.filter((p) => p.status === "waiting").length;
    const totalToday = patients.length;

    return (
        <div className="admin-card">
            <div className="admin-header">
                <p className="admin-eyebrow">Admin panel</p>
                <h3>Live queue overview</h3>

                <div className="summary-row">
                    <div className="summary-stat">
                        <p className="summary-value">{waitingCount}</p>
                        <p className="summary-label">Currently waiting</p>
                    </div>
                    <div className="summary-stat">
                        <p className="summary-value">{totalToday}</p>
                        <p className="summary-label">Registered today</p>
                    </div>
                </div>
            </div>

            <div className="table-wrap">
                <table>
                    <thead>
                        <tr>
                            <th>Token</th>
                            <th>Name</th>
                            <th>Contact</th>
                            <th>Status</th>
                            <th>Extra time</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {patients.map((patient) => (
                            <tr key={patient.id}>
                                <td>
                                    <span className="row-token">
                                        {String(patient.token_number).padStart(3, "0")}
                                    </span>
                                </td>
                                <td>{patient.name}</td>
                                <td>{patient.phone}</td>
                                <td>
                                    <span className={`status-badge status-${patient.status}`}>
                                        {statusLabel[patient.status]}
                                    </span>
                                </td>
                                <td>
                                    {patient.extra_minutes > 0 ? `+${patient.extra_minutes} min` : "—"}
                                </td>
                                <td>
                                    {patient.status === "waiting" && (
                                        <div className="row-actions">
                                            <button
                                                className="action-btn extend"
                                                onClick={() => handleExtend(patient.id)}
                                            >
                                                +2 min
                                            </button>
                                            <button
                                                className="action-btn remove"
                                                onClick={() => handleRemove(patient.id)}
                                            >
                                                Remove
                                            </button>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {patients.length === 0 && (
                    <p className="empty-state">No patients registered yet today.</p>
                )}
            </div>
        </div>
    );
}

export default AdminScreen;
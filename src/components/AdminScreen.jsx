import { useEffect, useState } from "react";
import { getAllPatients, extendPatientTime, removePatient } from "../api.js";
import { socket } from "../socket.js";

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

        // Re-fetch the list any time the queue changes -- including
        // changes made from this same screen (see handleExtend /
        // handleRemove below), and from any other admin device too,
        // since the whole point of sockets is everyone stays in sync.
        socket.on("queueUpdated", fetchPatients);

        return () => {
            socket.off("queueUpdated", fetchPatients);
        };
    }, []);

    const handleExtend = async (id) => {
        try {
            await extendPatientTime(id);
            // No need to manually update state here -- extendPatientTime
            // succeeding on the backend triggers a "queueUpdated" socket
            // broadcast, which our own listener above will catch and
            // use to refresh this list automatically.
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
            <div className="screen">
                <p>Loading patients...</p>
            </div>
        );
    }

    return (
        <div className="screen">
            <h3>Admin Panel</h3>

            <table>
                <thead>
                    <tr>
                        <th>Token</th>
                        <th>Name</th>
                        <th>Contact</th>
                        <th>Status</th>
                        <th>Extra Minutes</th>
                        <th>Actions</th>
                    </tr>
                </thead>

                <tbody>
                    {patients.map((patient) => (
                        <tr key={patient.id}>
                            <td>{patient.token_number}</td>
                            <td>{patient.name}</td>
                            <td>{patient.phone}</td>
                            <td>{patient.status}</td>
                            <td>{patient.extra_minutes}</td>
                            <td>
                                {patient.status === "waiting" && (
                                    <>
                                        <button onClick={() => handleExtend(patient.id)}>
                                            +2 Min
                                        </button>
                                        <button onClick={() => handleRemove(patient.id)}>
                                            Remove
                                        </button>
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default AdminScreen;
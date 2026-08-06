const API_URL = import.meta.env.VITE_API_URL;

// Registers a new patient. Returns the parsed JSON response
// (which includes the new token_number) if successful, and
// throws an error if the server responds with a failure status.
export async function registerPatient(name, phone) {
    const response = await fetch(`${API_URL}/register`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, phone }),
    });

    if (!response.ok) {
        throw new Error("Failed to register patient");
    }

    return response.json();
}

// Fetches a specific patient's live queue position, by their
// token number. Called once when the waiting screen loads, and
// again every time a "queueUpdated" socket event is received.
export async function getPatientPosition(tokenNumber) {
    const response = await fetch(`${API_URL}/patients/${tokenNumber}`);

    if (!response.ok) {
        throw new Error("Failed to fetch patient position");
    }

    return response.json();
}

// Fetches every patient in the system (any status), for the admin
// screen's table.
export async function getAllPatients() {
    const response = await fetch(`${API_URL}/admin/patients`);

    if (!response.ok) {
        throw new Error("Failed to fetch patients");
    }

    return response.json();
}

// Adds 2 extra minutes to a specific patient's wait time.
export async function extendPatientTime(id) {
    const response = await fetch(`${API_URL}/admin/extend-time`, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ id }),
    });

    if (!response.ok) {
        throw new Error("Failed to extend time");
    }

    return response.json();
}

// Marks a specific patient as removed from the queue.
export async function removePatient(id) {
    const response = await fetch(`${API_URL}/admin/remove/${id}`, {
        method: "PATCH",
    });

    if (!response.ok) {
        throw new Error("Failed to remove patient");
    }

    return response.json();
}
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
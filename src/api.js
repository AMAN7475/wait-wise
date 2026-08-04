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
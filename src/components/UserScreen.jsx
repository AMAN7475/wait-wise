import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerPatient } from "../api.js";

function UserScreen() {
    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [contactError, setContactError] = useState("");
    const [nameError, setNameError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState("");

    const generateToken = async (e) => {
        e.preventDefault();
        if (name.trim() === "" || contact.length !== 10) {
            alert("Enter valid details");
            return;
        }

        setIsSubmitting(true);
        setSubmitError("");

        try {
            // Calls POST /register on the backend, which saves the
            // patient in MySQL and returns their real token_number.
            const data = await registerPatient(name, contact);

            // Redirect the patient straight to their own waiting
            // screen URL, e.g. /waiting/6 -- this is what gives each
            // patient an individual, correct view going forward.
            navigate(`/waiting/${data.token_number}`);
        } catch (err) {
            setSubmitError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid =
        name.trim().length > 0 &&
        contact.length === 10 &&
        contactError === "";
    const isNameValid = name.trim().length > 0;
    const isContactValid = contact.length === 10 && contactError === "";

    return (
        <div className="screen">
            <h3>Reserve your Appointment</h3>

            <form onSubmit={generateToken}>
                {/* Name input */}
                <label>Patient's Name</label>
                <div className="input-wrapper">
                    <input
                        value={name}
                        onChange={(e) => {
                            const rawValue = e.target.value;

                            if (rawValue.length > 0) {
                                setNameError("Only Alphabets Allowed, Max. 30 Characters");
                            } else {
                                setNameError("");
                            }

                            let value = rawValue.replace(/[^a-zA-Z ]/g, "");

                            value = value
                                .toLowerCase()
                                .replace(/\b\w/g, (char) => char.toUpperCase());

                            setName(value.slice(0, 30));
                        }}
                        maxLength={30}
                        required
                    />
                    {isNameValid && <span className="tick">✔</span>}
                </div>

                {nameError && (
                    <p style={{ color: "#6b7280", fontSize: "12px", marginTop: "4px" }}>
                        {nameError}
                    </p>
                )}

                {/* Contact input */}
                <label>Contact Number</label>
                <div className="input-wrapper">
                    <input
                        value={contact}
                        onChange={(e) => {
                            const rawValue = e.target.value;

                            if (rawValue.length > 0) {
                                setContactError("Enter a Valid 10 Digit Number.");
                            } else {
                                setContactError("");
                            }

                            const value = rawValue.replace(/\D/g, "").slice(0, 10);
                            setContact(value);

                            if (value.length > 0 && !["6", "7", "8", "9"].includes(value[0])) {
                                setContactError("Contact Number should start with 6, 7, 8, or 9.");
                            } else if (value.length > 0 && value.length < 10) {
                                setContactError("Enter a Valid, 10 Digit Number.");
                            } else if (value.length === 10) {
                                setContactError("");
                            }
                        }}
                        required
                    />
                    {isContactValid && <span className="tick">✔</span>}
                </div>

                {contactError && (
                    <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                        {contactError}
                    </p>
                )}

                {submitError && (
                    <p style={{ color: "red", fontSize: "12px", marginTop: "4px" }}>
                        {submitError}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="generate-btn"
                    style={{
                        backgroundColor: isFormValid ? "#2563eb" : "#9ca3af",
                        cursor: isFormValid ? "pointer" : "not-allowed",
                        opacity: isFormValid ? 1 : 0.7,
                        paddingRight: 2
                    }}
                >
                    {isSubmitting ? "Registering..." : "Generate Token"}
                </button>
            </form>
        </div>
    );
}

export default UserScreen;
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerPatient } from "../api.js";
import "./UserScreen.css";

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
            const data = await registerPatient(name, contact);
            navigate(`/waiting/${data.token_number}`);
        } catch (err) {
            setSubmitError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isNameValid = name.trim().length > 0;
    const isContactValid = contact.length === 10 && contactError === "";
    const isFormValid = isNameValid && isContactValid;

    return (
        <div className="register-card">
            <div className="register-header">
                <div className="clinic-title">
                    <span className="welcome-text">Welcome to</span>
                    <span className="clinic-name">Dr. Akanksha's Physiotherapy Clinic</span>
                </div>
            </div>

            <div className="register-body">
                <p className="subtitle">Enter the details below and get your token.</p>

                <form onSubmit={generateToken}>
                <div className="field">
                    <label>Patient's name</label>
                    <div className="input-wrapper">
                        <input
                            value={name}
                            onChange={(e) => {
                                const rawValue = e.target.value;

                                if (rawValue.length > 0) {
                                    setNameError("Only alphabets allowed, max 30 characters");
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
                            placeholder="e.g. Priya Sharma"
                            required
                        />
                        {isNameValid && <span className="tick">✔</span>}
                    </div>
                    {nameError && <p className="field-hint">{nameError}</p>}
                </div>

                <div className="field">
                    <label>Contact number</label>
                    <div className="input-wrapper">
                        <input
                            value={contact}
                            onChange={(e) => {
                                const rawValue = e.target.value;
                                const value = rawValue.replace(/\D/g, "").slice(0, 10);
                                setContact(value);

                                if (value.length === 0) {
                                    setContactError("");
                                } else if (!["6", "7", "8", "9"].includes(value[0])) {
                                    setContactError("Contact number should start with 6, 7, 8, or 9");
                                } else if (value.length < 10) {
                                    setContactError("Enter a valid 10 digit number");
                                } else {
                                    setContactError("");
                                }
                            }}
                            placeholder="10 digit mobile number"
                            required
                        />
                        {isContactValid && <span className="tick">✔</span>}
                    </div>
                    {contactError && <p className="field-error">{contactError}</p>}
                </div>

                {submitError && <p className="field-error">{submitError}</p>}

                <button
                    type="submit"
                    disabled={!isFormValid || isSubmitting}
                    className="generate-btn"
                >
                    {isSubmitting ? "Registering..." : "Generate token"}
                </button>
            </form>
            </div>
        </div>
    );
}

export default UserScreen;
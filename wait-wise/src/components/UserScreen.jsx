import { useState } from "react";

function UserScreen({ queue, setQueue, tokenCounter, setTokenCounter }) {
    const [name, setName] = useState("");
    const [contact, setContact] = useState("");
    const [token, setToken] = useState(null);
    const [showThankYou, setShowThankYou] = useState(false);
    const [contactError, setContactError] = useState("");
    const [nameError, setNameError] = useState("");

    const generateToken = (e) => {
    e.preventDefault();
        if (name.trim() === "" || contact.length !== 10) {
            alert("Enter valid details");
            return;
        }

        const newToken = tokenCounter;
        const newUser = {
            token: newToken,
            name: name,
            contact: contact,
            createdAt: Date.now() 
        };

        setQueue([...queue, newUser]);
        setTokenCounter(tokenCounter + 1);

        localStorage.setItem("currentUserToken", newToken);

        setToken(newToken);
        setShowThankYou(true);

        setName("");
        setContact("");
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

            {/* Show form only when thank-you screen is NOT visible */}
            {!showThankYou && (
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

                                // Allow only alphabets & space
                                let value = rawValue.replace(/[^a-zA-Z ]/g, "");

                                // Capitalize each word
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
                                
                                // Show helper message as soon as user types anything
                                if (rawValue.length > 0) {
                                    setContactError("Enter a Valid 10 Digit Number.");
                                } else {
                                    setContactError("");
                                }

                                // Keep only digits, max 10
                                const value = rawValue.replace(/\D/g, "").slice(0, 10);
                                setContact(value);

                                // Validation checks
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
                
                    <button
                        type="submit"
                        disabled={!isFormValid}
                        className="generate-btn"
                        style={{

                            backgroundColor: isFormValid ? "#2563eb" : "#9ca3af",
                            cursor: isFormValid ? "pointer" : "not-allowed",
                            opacity: isFormValid ? 1 : 0.7,
                            paddingRight: 2
                        }}
                    >
                        Generate Token
                    </button>

                </form>
            )}

            {/* Always show token section */}
            <p>
                <strong>Your Token:</strong>{" "}
                <span id="userToken">{token}</span>
            </p>

            {/* Thank you message after token generation */}
            {showThankYou && (
            <div className="thank-you">
                <p>Thank you! Your token has been generated.</p>

                {/* Go back to form */}
                <button onClick={() => setShowThankYou(false)}>
                Back
                </button>
            </div>
            )}

        </div>
    );
}  

export default UserScreen;
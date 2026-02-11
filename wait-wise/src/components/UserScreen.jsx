import { useState } from "react";

function UserScreen({ queue, setQueue, tokenCounter, setTokenCounter }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [token, setToken] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

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

    setTokenCounter(tokenCounter + 1);
    localStorage.setItem("currentUserToken", newToken);

    setToken(newToken);
    setShowThankYou(true);

    setName("");
    setContact("");
  };  
  return (
    <div className="screen">

      <h3>Reserve your Appointment</h3>

      {/* Show form only when thank-you screen is NOT visible */}
      {!showThankYou && (
        <form onSubmit={generateToken}>

          {/* Name input */}
          <label>Full Name</label>
          <input
            value={name}
            onChange={(e) =>
              // Allow only alphabets and space
              setName(e.target.value.replace(/[^a-zA-Z ]/g, ""))
            }
            maxLength="30"
            required
          />

          {/* Contact input */}
          <label>Contact Number</label>
          <input
            value={contact}
            onChange={(e) =>
              // Allow only numbers and limit to 10 digits
              setContact(e.target.value.replace(/\D/g, "").slice(0, 10))
            }
            required
          />

          <button type="submit">Generate Token</button>
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
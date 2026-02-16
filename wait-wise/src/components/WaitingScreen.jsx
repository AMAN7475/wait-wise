import React from 'react'
import { useEffect, useState } from "react";
import "./Waiting.css";

function WaitingScreen({ queue, serviceStartTime, goToAdmin }) {
  const [yourToken, setYourToken] = useState(null);
  const [tokensAhead, setTokensAhead] = useState([]);
  const [estimatedTime, setEstimatedTime] = useState("Calculating...");
  const [remainingTime, setRemainingTime] = useState(null);

  const currentlyServing = queue.length > 0 ? queue[0].token : null;
  const SERVICE_TIME = 2 * 60 * 1000;

  useEffect(() => {
    const token = Number(localStorage.getItem("currentUserToken"));
    setYourToken(token);

    if (!token || queue.length === 0) {
      setTokensAhead([]);
      setEstimatedTime("No waiting");
      return;
    }

    const userIndex = queue.findIndex(
      item => item.token === token
    );

    if (userIndex === -1) {
      setTokensAhead([]);
      setEstimatedTime("Now");
      return;
    }

    setTokensAhead(queue.slice(0, userIndex));
  }, [queue]);


  useEffect(() => {
    if (!yourToken || queue.length === 0) {
      setRemainingTime(null);
      return;
    }

    const userIndex = queue.findIndex(
      item => item.token === yourToken
    );

    if (userIndex <= 0) {
      setRemainingTime(null);
      return;
    }

    let remaining = userIndex * SERVICE_TIME;
    setRemainingTime(remaining);

    const interval = setInterval(() => {
      remaining -= 1000;
      setRemainingTime(remaining > 0 ? remaining : 0);
    }, 1000);

    return () => clearInterval(interval);
  }, [queue, yourToken]);

  const formatTime = (ms) => {
    if (ms === null) return "--:--";

    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;

    return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div className="waiting-container">
      <h2 className="sub-heading">WAITING LIST</h2>

      <ul>
        {queue.map((item, index) => {
          const isCurrentlyServing = index === 0;
          const isYourToken = item.token === yourToken;

          let style = {
            padding: "10px",
            marginBottom: "6px",
            borderRadius: "6px",
          };

          if (isCurrentlyServing) {
            style.background = "#16a34a";
            style.color = "white";
            style.fontWeight = "bold";
          } else if (isYourToken) {
            style.background = "#2563eb";
            style.color = "white";
            style.fontWeight = "bold";
          } else {
            style.background = "#f0f0f0";
            style.color = "black";
          }

          return (
            <li key={item.token} style={style}>
              Token {item.token}
              {isCurrentlyServing && " (Currently Served)"}
              {isYourToken && !isCurrentlyServing && " (You)"}
            </li>
          );
        })}
      </ul>

      <p className="eta">
        You Are Next In :
        <span className="time-value">
          {remainingTime !== null
            ? formatTime(remainingTime)
            : "No waiting"}
        </span>
      </p>
    </div>
  );

}  
export default WaitingScreen;

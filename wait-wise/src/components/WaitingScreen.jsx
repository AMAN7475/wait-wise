import React from 'react'
import { useEffect, useState } from "react";

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

}  
export default WaitingScreen;

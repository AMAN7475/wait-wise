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

}

export default WaitingScreen;

import { useState } from "react";

function UserScreen({ queue, setQueue, tokenCounter, setTokenCounter }) {
  const [name, setName] = useState("");
  const [contact, setContact] = useState("");
  const [token, setToken] = useState(null);
  const [showThankYou, setShowThankYou] = useState(false);

}  
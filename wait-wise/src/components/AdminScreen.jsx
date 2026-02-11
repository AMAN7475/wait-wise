function AdminScreen({ queue, setQueue, setTokenCounter, setServiceStartTime }) {

  const serveNext = () => {
    if (queue.length === 0) {
      alert("No tokens in queue");
      return;
    }

    setQueue(queue.slice(1));
    setServiceStartTime(Date.now());
  };

  const resetQueue = () => {
    if (!window.confirm("Reset queue?")) return;

    setQueue([]);
    setTokenCounter(1);
    localStorage.removeItem("currentUserToken");
  };

  return()

}

export default AdminScreen;
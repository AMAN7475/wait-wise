function AdminScreen({ queue, setQueue, setTokenCounter, setServiceStartTime, setExtraDelay }) {

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

    const addDelay = () => {
    setExtraDelay(prev => prev + 2 * 60 * 1000);
    };


  return (
    <div className="screen">

      <h3>Admin Panel</h3>

      <button
        style={{ marginLeft: 75 }}
        onClick={serveNext}>
        Bring Next
      </button>

      <button onClick={resetQueue}>
        Reset Queue
      </button>

      <button onClick={addDelay}>
        +2 Mins Delay
      </button>

      

      <table>
        <thead>
          <tr>
            <th>Token</th>
            <th>Name</th>
            <th>Contact</th>
          </tr>
        </thead>

        <tbody>
          {queue.map((item, index) => (
            <tr key={index}>
              <td>{item.token}</td>
              <td>{item.name}</td>
              <td>{item.contact}</td>
            </tr>
          ))}
        </tbody>
      </table>

    </div>
  );
}

export default AdminScreen;
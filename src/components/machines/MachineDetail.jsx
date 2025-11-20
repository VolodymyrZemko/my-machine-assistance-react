import React, { useEffect, useState } from 'react';

export function MachineDetail({ machine, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  if (!machine) return null;

  useEffect(() => {
    const prev = document.title;
    document.title = `${machine.name} • Machine Detail`;
    return () => { document.title = prev; };
  }, [machine]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);
    setData(null);

    const url = `https://www.nespresso.com/shared_res/markets/gr/json/machine-assistance/v2/${machine.id}_en.json`;

    fetch(url)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        if (!cancelled) {
          setData(json);
          setLoading(false);
        }
      })
      .catch(err => {
        if (!cancelled) {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [machine.id]);

  return (
    <div className="machine-detail">
      <button className="back-button" onClick={onClose}>← Back</button>
      <h2>{machine.name}</h2>
      <img src={machine.img} alt={machine.name} />
      <p><strong>Technology:</strong> {machine.technology}</p>
      <ul className="meta">
        <li><strong>ID:</strong> {machine.id}</li>
      </ul>

      {loading && <p className="status-loading">Loading machine data...</p>}
      {error && <p className="status-error">Error loading data: {error}</p>}
      {data && (
        <div className="machine-data">
          <h3>Machine Assistance Data</h3>
          <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

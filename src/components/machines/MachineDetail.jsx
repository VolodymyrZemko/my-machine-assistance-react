import React, { useEffect } from 'react';

export function MachineDetail({ machine, onClose }) {
  useEffect(() => {
    if (machine) {
      document.title = `${machine.name} • Machine Detail`;
    } else {
      document.title = 'Machine Not Found';
    }
    return () => { document.title = 'Machines'; };
  }, [machine]);

  if (!machine) {
    return (
      <div className="machine-detail">
        <h2>Machine not found</h2>
        <button onClick={onClose}>Back</button>
      </div>
    );
  }

  return (
    <div className="machine-detail">
      <button onClick={onClose} style={{ marginBottom: '1rem' }}>← Back</button>
      <h1>{machine.name}</h1>
      <img src={machine.img} alt={machine.name} width={200} height={200} loading="lazy" />
      <ul className="meta">
        <li><strong>ID:</strong> {machine.id}</li>
        <li><strong>Technology:</strong> {machine.technology}</li>
      </ul>
    </div>
  );
}

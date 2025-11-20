import React, { useEffect } from 'react';

export function MachineDetail({ machine, onClose }) {
  if (!machine) return null;

  useEffect(() => {
    const prev = document.title;
    document.title = `${machine.name} • Machine Detail`;
    return () => { document.title = prev; };
  }, [machine]);

  return (
    <div className="machine-detail">
      <button className="back-button" onClick={onClose}>← Back</button>
      <h2>{machine.name}</h2>
      <img src={machine.img} alt={machine.name} />
      <p><strong>Technology:</strong> {machine.technology}</p>
      <ul className="meta">
        <li><strong>ID:</strong> {machine.id}</li>
      </ul>
    </div>
  );
}

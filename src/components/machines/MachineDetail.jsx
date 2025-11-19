import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { machinesData } from '../../data/machines.js';

export function MachineDetail() {
  const { id } = useParams();
  const machine = machinesData.find(m => m.id === id);

  useEffect(() => {
    if (machine) {
      document.title = `${machine.name} • Machine Detail`;
    } else {
      document.title = 'Machine Not Found';
    }
  }, [machine]);

  if (!machine) {
    return (
      <div className="machine-detail">
        <h2>Machine not found</h2>
        <p>No machine exists with id: <code>{id}</code></p>
        <Link to="/">Back to machines</Link>
      </div>
    );
  }

  return (
    <div className="machine-detail">
      <Link to="/">← Back</Link>
      <h1>{machine.name}</h1>
      <img src={machine.img} alt={machine.name} width={200} height={200} loading="lazy" />
      <ul className="meta">
        <li><strong>ID:</strong> {machine.id}</li>
        <li><strong>Technology:</strong> {machine.technology}</li>
      </ul>
    </div>
  );
}

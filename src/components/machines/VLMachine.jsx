import React from 'react';
import machines from '../../data/machines.json';

export function VLMachine() {
  const list = machines.filter(m => m.technology === 'VL');
  return (
    <div>
      <h3>VL Machines</h3>
      <div className="machine-grid">
        {list.map(machine => (
          <div key={machine.id} className="machine-card">
            <a href={`#machine/${machine.id}`}>
              <img src={machine.img} alt={machine.name} />
              <p>{machine.name}</p>
            </a>
          </div>
        ))}
        {list.length === 0 && <p>No VL machines.</p>}
      </div>
    </div>
  );
}

import React from 'react';
import machines from '../../data/machines.json';

export function MilkMachine() {
  const list = machines.filter(m => m.technology === 'MILK');
  return (
    <div>
      <h3>Milk Machines</h3>
      <div className="machine-grid">
        {list.map(machine => (
          <div key={machine.id} className="machine-card">
            <a href={`#machine/${machine.id}`}>
              <img src={machine.img} alt={machine.name} />
              <p>{machine.name}</p>
            </a>
          </div>
        ))}
        {list.length === 0 && <p>No Milk machines.</p>}
      </div>
    </div>
  );
}

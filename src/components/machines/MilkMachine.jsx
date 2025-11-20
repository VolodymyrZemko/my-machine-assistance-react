import React from 'react';
import { getMachinesByTechnology } from '../../data/machines.js';

export function MilkMachine() {
  const milkMachines = getMachinesByTechnology('MILK');
  return (
    <div>
      <h2>Milk Machines</h2>
      <ul className="machine-list">
        {milkMachines.map(m => (
          <li key={m.id} className="machine-item">
            <img src={m.img} alt={m.name} width={120} height={120} loading="lazy" />
            <p>{m.name}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

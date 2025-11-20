import React from 'react';
import { Link } from 'react-router-dom';
import { getMachinesByTechnology } from '../../data/machines.js';

export function MilkMachine() {
  const milkMachines = getMachinesByTechnology('MILK');
  return (
    <div>
      <h2>Milk Machines</h2>
      <ul className="machine-list">
        {milkMachines.map(m => (
          <li key={m.id} className="machine-item">
            <Link to={`/machine/${m.id}`}>
              <img src={m.img} alt={m.name} width={120} height={120} loading="lazy" />
              <p>{m.name}</p>
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

import React from 'react';
import { useUserContext } from '../../context/UserContext.jsx';

export function MyAccountMachine() {
  const { memberId, machines, loading, error, refreshMachines } = useUserContext();

  if (loading) return <p>Loading...</p>;
  // Unified message when not logged in OR error
  if (!memberId || error) return <p>please log in to see your machine</p>;

  return (
    <div>
      <h2>My Machines</h2>
      <button onClick={refreshMachines} style={{ marginBottom: '1rem' }}>Refresh list</button>
      {machines.length === 0 ? (
        <p>You have no machines yet.</p>
      ) : (
        <ul>
          {machines.map((machine, index) => (
            <li key={index} className="machine-item">
              <h3>{machine.name}</h3>
              <p><strong>Serial number:</strong> {machine.serialNumber}</p>
              <p><strong>Purchase date:</strong> {machine.purchaseDate}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

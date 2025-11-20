import React from 'react';
import { useUserContext } from '../../context/UserContext.jsx';

export function MyAccountMachine() {
  const { memberId, machines, loading, error, refreshMachines } = useUserContext() || {};

  return (
    <div>
      <h3>My Account Machine</h3>
      {!memberId && !loading && <p>User not logged in. <button onClick={refreshMachines}>Retry</button></p>}
      {loading && <p>Loading user data...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {memberId && <p><strong>Member:</strong> {memberId}</p>}
      {memberId && (
        <div className="machine-grid">
          {machines && machines.length > 0 ? machines.map(m => (
            <div key={m.serialNumber || m.id} className="machine-card">
              <span>{m.name || m.id}</span>
            </div>
          )) : <p>No registered machines.</p>}
        </div>
      )}
    </div>
  );
}

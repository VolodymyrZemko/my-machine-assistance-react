import { useEffect, useState } from 'react';

// Parses location.hash of form '#machine/<id>' and returns machineId or null
function parseHash() {
  const hash = window.location.hash || '';
  if (hash.startsWith('#machine/')) {
    return hash.replace('#machine/', '').trim() || null;
  }
  return null;
}

export function useMachineRoute() {
  const [machineId, setMachineId] = useState(parseHash());

  useEffect(() => {
    function handle() {
      setMachineId(parseHash());
    }
    window.addEventListener('hashchange', handle);
    return () => window.removeEventListener('hashchange', handle);
  }, []);

  // Helper to navigate programmatically
  function openMachine(id) {
    window.location.hash = `machine/${id}`;
  }
  function closeMachine() {
    if (window.location.hash) {
      history.replaceState(null, '', window.location.pathname + window.location.search);
    }
    setMachineId(null);
  }

  return { machineId, openMachine, closeMachine };
}

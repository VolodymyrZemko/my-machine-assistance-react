import { useEffect, useState, useCallback } from 'react';

// Parse hash of form '#machine/<id>'
function parseHash() {
  const hash = window.location.hash || '';
  if (hash.startsWith('#machine/')) {
    const id = hash.slice('#machine/'.length).trim();
    return id || null;
  }
  return null;
}

export function useMachineRoute() {
  const [machineId, setMachineId] = useState(parseHash());

  useEffect(() => {
    function onHashChange() {
      setMachineId(parseHash());
    }
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const openMachine = useCallback((id) => {
    if (!id) return;
    window.location.hash = `machine/${id}`;
  }, []);

  const closeMachine = useCallback(() => {
    // Clear hash but keep current path
    history.replaceState(null, '', window.location.pathname + window.location.search);
    setMachineId(null);
  }, []);

  return { machineId, openMachine, closeMachine };
}

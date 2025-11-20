import { useEffect, useState, useCallback } from 'react';

// Parse hash of form '#!/<id>' or '#!/<id>/tab'
function parseHash() {
  const hash = window.location.hash || '';
  if (hash.startsWith('#!/')) {
    const parts = hash.slice(3).split('/'); // Remove #!/ and split
    if (parts.length >= 1 && parts[0]) {
      return parts[0]; // Return the machine ID (first part after #!/)
    }
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
    window.location.hash = `#!/${id}`;
  }, []);

  const closeMachine = useCallback(() => {
    // Clear hash but keep current path
    history.replaceState(null, '', window.location.pathname + window.location.search);
    setMachineId(null);
  }, []);

  return { machineId, openMachine, closeMachine };
}

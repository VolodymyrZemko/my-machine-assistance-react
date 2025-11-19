import { useEffect, useRef, useState } from 'react';

// Simple in-memory cache so we don't refetch same machine repeatedly in a session.
const detailCache = new Map();

export function useMachineDetail(id) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  useEffect(() => {
    if (!id) return;
    let active = true;
    setLoading(true);
    setError(null);

    // Serve from cache if present.
    if (detailCache.has(id)) {
      setData(detailCache.get(id));
      setLoading(false);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;

    const url = `https://www.nespresso.com/shared_res/markets/gr/json/machine-assistance/v2/${id}_en.json`;

    fetch(url, { signal: controller.signal })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }
        return res.json();
      })
      .then((json) => {
        if (!active) return;
        detailCache.set(id, json);
        setData(json);
      })
      .catch((e) => {
        if (!active || e.name === 'AbortError') return;
        setError(e.message || 'Failed to load machine details');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
      controller.abort();
    };
  }, [id]);

  return { data, loading, error };
}

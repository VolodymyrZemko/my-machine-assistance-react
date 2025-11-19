import { useState, useEffect } from "react";
import { slugify } from "../utils/slugify.js";

export function useMachineDetail(slug) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!slug) { setLoading(false); return; }
    let cancelled = false;
    async function fetchDetail() {
      try {
        const safeSlug = slugify(slug);
        const url = `https://www.nespresso.com/shared_res/markets/gr/json/machine-assistance/v2/${safeSlug}_en.json`;
        const res = await fetch(url);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        if (!cancelled) setData(json);
      } catch (err) {
        if (!cancelled) setError(err.message || "Fetch error");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    fetchDetail();
    return () => { cancelled = true; };
  }, [slug]);

  return { data, loading, error };
}

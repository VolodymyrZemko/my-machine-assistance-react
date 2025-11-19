import { useState, useEffect } from "react";

/**
 * useUserMachines
 * Handles login detection + machine fetching via window.napi.
 * Returns: { loading, error, memberId, machines }
 */
export function useUserMachines() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [memberId, setMemberId] = useState(null);
  const [machines, setMachines] = useState([]);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      try {
        if (!window.napi) {
          setLoading(false);
          return;
        }
        const customer = await window.napi.customer().read();
        const id = customer.memberNumber || null;
        if (!id) {
          setMemberId(null);
          setLoading(false);
          return;
        }
        setMemberId(id);
        await fetchMachines();
      } catch (err) {
        if (!cancelled) {
          setError("Помилка перевірки входу");
          setLoading(false);
        }
      }
    }

    async function fetchMachines() {
      try {
        const userMachines = await window.napi.customer().getMachines();
        if (!userMachines || userMachines.length === 0) {
          setMachines([]);
          return;
        }
        const data = await Promise.all(
          userMachines.map(async ({ productId, serialNumber, purchaseDate }) => {
            try {
              const id = productId.split("/").pop();
              const product = await window.napi.catalog().getProduct(id);
              return { ...product, serialNumber, purchaseDate };
            } catch (err) {
              return { name: productId, serialNumber, purchaseDate };
            }
          })
        );
        if (!cancelled) {
          setMachines(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError("Помилка отримання машин");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, []);

  return { loading, error, memberId, machines };
}

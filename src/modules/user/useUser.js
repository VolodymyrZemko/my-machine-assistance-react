import { useState, useEffect, useCallback } from 'react';

/**
 * Hook: useUser
 * Responsibilities:
 * - Detect logged-in user (memberId)
 * - Fetch user's registered machines (with serialNumber & purchaseDate)
 * - Expose loading/error states & manual refresh
 */
export function useUser() {
  const [memberId, setMemberId] = useState(null);
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMachines = useCallback(async () => {
    if (!memberId) return;
    setLoading(true);
    try {
      const userMachines = await window.napi.customer().getMachines();
      if (!Array.isArray(userMachines) || userMachines.length === 0) {
        setMachines([]);
        return;
      }
      const enriched = await Promise.all(
        userMachines.map(async ({ productId, serialNumber, purchaseDate }) => {
          try {
            const productData = await window.napi.catalog().getProduct(productId.split('/').pop());
            return { ...productData, serialNumber, purchaseDate };
          } catch (e) {
            console.warn('Failed to fetch product', productId, e);
            return { name: 'Unknown Machine', serialNumber, purchaseDate };
          }
        })
      );
      setMachines(enriched);
    } catch (e) {
      console.error('Error fetching machines:', e);
      setError('Помилка отримання машин');
    } finally {
      setLoading(false);
    }
  }, [memberId]);

  const init = useCallback(async () => {
    setLoading(true);
    try {
      const customer = await window.napi.customer().read();
      const id = customer.memberNumber || null;
      setMemberId(id);
      if (id) {
        await fetchMachines();
      } else {
        setLoading(false);
      }
    } catch (e) {
      console.error('Error in user init:', e);
      setError('Помилка перевірки входу');
      setLoading(false);
    }
  }, [fetchMachines]);

  useEffect(() => {
    init();
  }, [init]);

  return { memberId, machines, loading, error, refreshMachines: fetchMachines };
}

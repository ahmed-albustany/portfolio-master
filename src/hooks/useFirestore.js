import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Generic Firestore hook that accepts any async fetch function.
 *
 * Usage:
 *   const { data, loading, error, refetch } = useFirestore(getProjects);
 *   const { data, loading, error, refetch } = useFirestore(getPersonalInfo, fallbackInfo);
 */
export function useFirestore(fetchFunction, fallback = null) {
  const [data, setData] = useState(fallback);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fnRef = useRef(fetchFunction);
  fnRef.current = fetchFunction;

  const fetch = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await fnRef.current();
      // Use fallback if result is null/undefined or an empty array
      if (result == null || (Array.isArray(result) && result.length === 0)) {
        setData(fallback);
      } else {
        setData(result);
      }
    } catch (err) {
      console.error('[useFirestore] fetch failed:', err);
      setError(err);
      setData(fallback);
    } finally {
      setLoading(false);
    }
  }, [fallback]);

  useEffect(() => {
    fetch();
  }, [fetch]);

  return { data, loading, error, refetch: fetch };
}

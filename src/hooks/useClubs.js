import { useState, useEffect, useCallback } from 'react';
import { getClubs } from '../services/clubsApi';

export function useClubs() {
  const [result, setResult] = useState({ key: null, clubs: [], error: null });
  const [reloadCount, setReloadCount] = useState(0);

  const requestKey = String(reloadCount);

  useEffect(() => {
    let cancelled = false;

    getClubs()
      .then((clubs) => {
        if (!cancelled) setResult({ key: requestKey, clubs, error: null });
      })
      .catch((error) => {
        if (!cancelled) setResult({ key: requestKey, clubs: [], error });
      });

    return () => {
      cancelled = true;
    };
  }, [requestKey]);

  const loading = result.key !== requestKey;
  const refetch = useCallback(() => setReloadCount((c) => c + 1), []);

  return {
    clubs: result.clubs,
    loading,
    error: loading ? null : result.error,
    refetch,
  };
}

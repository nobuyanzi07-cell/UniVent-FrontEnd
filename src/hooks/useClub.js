import { useState, useEffect, useCallback } from 'react';
import { getClubById } from '../services/clubsApi';

export function useClub(id) {
  const [result, setResult] = useState({ key: null, club: null, error: null });
  const [reloadCount, setReloadCount] = useState(0);

  const requestKey = `${id}|${reloadCount}`;

  useEffect(() => {
    if (!id) return;
    let cancelled = false;

    getClubById(id)
      .then((club) => {
        if (!cancelled) setResult({ key: requestKey, club, error: null });
      })
      .catch((error) => {
        if (!cancelled) setResult({ key: requestKey, club: null, error });
      });

    return () => {
      cancelled = true;
    };
  }, [id, requestKey]);

  const loading = Boolean(id) && result.key !== requestKey;
  const refetch = useCallback(() => setReloadCount((c) => c + 1), []);

  return {
    club: loading ? null : result.club,
    loading,
    error: loading ? null : result.error,
    refetch,
  };
}

import { useCallback, useEffect, useState } from "react";
import { listClubs } from "../services/clubsApi";

// Loads clubs for one university id. Pass an empty id to skip loading.
export function useClubs(universityId) {
  const [result, setResult] = useState({ key: null, clubs: [], error: null });
  const [reloadCount, setReloadCount] = useState(0);

  const requestKey = `${universityId}|${reloadCount}`;

  useEffect(() => {
    if (!universityId) return;
    let cancelled = false;

    listClubs({ universityId })
      .then((clubs) => {
        if (!cancelled) setResult({ key: requestKey, clubs, error: null });
      })
      .catch((error) => {
        if (!cancelled) setResult({ key: requestKey, clubs: [], error });
      });

    return () => {
      cancelled = true;
    };
  }, [universityId, requestKey]);

  const loading = Boolean(universityId) && result.key !== requestKey;
  const refetch = useCallback(() => setReloadCount((c) => c + 1), []);
  const current = Boolean(universityId) && !loading;

  return {
    clubs: current ? result.clubs : [],
    loading,
    error: current ? result.error : null,
    refetch,
  };
}

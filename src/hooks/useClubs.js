import { useCallback, useEffect, useState } from "react";
import { listClubs } from "../services/clubsApi";

// Loads clubs for one university. Pass an empty university to skip loading.
export function useClubs(university) {
  const [result, setResult] = useState({ key: null, clubs: [], error: null });
  const [reloadCount, setReloadCount] = useState(0);

  const requestKey = `${university}|${reloadCount}`;

  useEffect(() => {
    if (!university) return;
    let cancelled = false;

    listClubs({ university })
      .then((clubs) => {
        if (!cancelled) setResult({ key: requestKey, clubs, error: null });
      })
      .catch((error) => {
        if (!cancelled) setResult({ key: requestKey, clubs: [], error });
      });

    return () => {
      cancelled = true;
    };
  }, [university, requestKey]);

  const loading = Boolean(university) && result.key !== requestKey;
  const refetch = useCallback(() => setReloadCount((c) => c + 1), []);
  const current = university && !loading;

  return {
    clubs: current ? result.clubs : [],
    loading,
    error: current ? result.error : null,
    refetch,
  };
}
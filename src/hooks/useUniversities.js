import { useCallback, useEffect, useState } from "react";
import { listUniversities } from "../services/universitiesApi";

// Loads the universities for the University dropdowns.
export function useUniversities() {
  const [result, setResult] = useState({ key: null, universities: [], error: null });
  const [reloadCount, setReloadCount] = useState(0);

  useEffect(() => {
    let cancelled = false;

    listUniversities()
      .then((universities) => {
        if (!cancelled) setResult({ key: reloadCount, universities, error: null });
      })
      .catch((error) => {
        if (!cancelled) setResult({ key: reloadCount, universities: [], error });
      });

    return () => {
      cancelled = true;
    };
  }, [reloadCount]);

  const loading = result.key !== reloadCount;
  const refetch = useCallback(() => setReloadCount((c) => c + 1), []);

  return {
    universities: loading ? [] : result.universities,
    loading,
    error: loading ? null : result.error,
    refetch,
  };
}

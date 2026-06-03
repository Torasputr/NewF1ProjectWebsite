import { useEffect, useState } from "react";
import { fetchSessionResults } from "../lib/fetchSessionResults";
import type { SessionResultRow } from "../types/sessionResults";

export function useSessionResults() {
  const [data, setData] = useState<SessionResultRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchSessionResults()
      .then((rows) => {
        if (!cancelled) setData(rows);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return { data, loading, error };
}

import { useEffect, useState } from "react";
import { fetchSessionResults } from "../lib/fetchSessionResults";
import { fetchQualiResults } from "../lib/fetchQualiResults";
import type { SessionResultRow } from "../types/sessionResults";

export function useSessionResults() {
  const [data, setData] = useState<SessionResultRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    Promise.all([
      fetchSessionResults(),
      fetchQualiResults().catch(() => [] as SessionResultRow[]),
    ])
      .then(([race, quali]) => {
        if (!cancelled) setData([...race, ...quali]);
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

import { useEffect, useState } from "react";
import { useSeason } from "../context/SeasonContext";
import { fetchSessionResults } from "../lib/fetchSessionResults";
import { fetchQualiResults } from "../lib/fetchQualiResults";
import { fetchFpResults } from "../lib/fetchFpResults";
import type { SessionResultRow } from "../types/sessionResults";

export function useSessionResults() {
  const { year } = useSeason();
  const [data, setData] = useState<SessionResultRow[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setLoading(true);
    setError(null);

    Promise.all([
      fetchSessionResults(year),
      fetchQualiResults(year).catch(() => [] as SessionResultRow[]),
      fetchFpResults(year).catch(() => [] as SessionResultRow[]),
    ])
      .then(([race, quali, fp]) => {
        if (!cancelled) setData([...race, ...quali, ...fp]);
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setData(null);
          setError(err instanceof Error ? err.message : "Unknown error");
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [year]);

  return { data, loading, error, year };
}

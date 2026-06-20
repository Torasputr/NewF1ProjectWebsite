import { useEffect, useState } from "react";
import { useSeason } from "../context/SeasonContext";
import { fetchConstructorStandings } from "../lib/fetchConstructorStandings";
import type { ConstructorStanding } from "../types/constructorStanding";

export function useConstructorStandings() {
  const { year } = useSeason();
  const [data, setData] = useState<ConstructorStanding[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setLoading(true);
    setError(null);

    fetchConstructorStandings(year)
      .then((rows) => {
        if (!cancelled) setData(rows);
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

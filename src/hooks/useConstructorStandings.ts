import { useEffect, useState } from "react";
import { fetchConstructorStandings } from "../lib/fetchConstructorStandings";
import type { ConstructorStanding } from "../types/constructorStanding";

export function useConstructorStandings() {
  const [data, setData] = useState<ConstructorStanding[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchConstructorStandings()
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

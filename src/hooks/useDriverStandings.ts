import { useEffect, useState } from "react";
import { useSeason } from "../context/SeasonContext";
import { fetchDriverStandings } from "../lib/fetchDriverStandings";
import type { Driver } from "../types/driver";

export function useDriverStandings() {
  const { year, latestSeason } = useSeason();
  const [data, setData] = useState<Driver[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setLoading(true);
    setError(null);

    fetchDriverStandings(year, latestSeason)
      .then((drivers) => {
        if (!cancelled) setData(drivers);
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
  }, [year, latestSeason]);

  return { data, loading, error, year };
}

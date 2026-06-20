import { useEffect, useState } from "react";
import { useSeason } from "../context/SeasonContext";
import { fetchDrivers } from "../lib/fetchDrivers";
import type { Driver } from "../types/driver";

export function useDrivers() {
  const { year } = useSeason();
  const [data, setData] = useState<Driver[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setLoading(true);
    setError(null);

    fetchDrivers(year)
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
  }, [year]);

  return { data, loading, error, year };
}

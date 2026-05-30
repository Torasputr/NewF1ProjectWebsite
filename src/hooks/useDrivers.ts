import { useEffect, useState } from "react";
import { fetchDrivers } from "../lib/fetchDrivers";
import type { Driver } from "../types/driver";

export function useDrivers() {
  const [data, setData] = useState<Driver[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchDrivers()
      .then((drivers) => {
        if (!cancelled) setData(drivers);
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

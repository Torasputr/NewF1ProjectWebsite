import { useEffect, useState } from "react";
import { fetchSchedule } from "../lib/fetchSchedule";
import type { ScheduleSession } from "../types/schedule";

export function useSchedule() {
  const [data, setData] = useState<ScheduleSession[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchSchedule()
      .then((sessions) => {
        if (!cancelled) setData(sessions);
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
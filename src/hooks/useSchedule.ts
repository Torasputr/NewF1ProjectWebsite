import { useEffect, useState } from "react";
import { useSeason } from "../context/SeasonContext";
import { fetchSchedule } from "../lib/fetchSchedule";
import type { ScheduleSession } from "../types/schedule";

export function useSchedule() {
  const { year } = useSeason();
  const [data, setData] = useState<ScheduleSession[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    setData(null);
    setLoading(true);
    setError(null);

    fetchSchedule(year)
      .then((sessions) => {
        if (!cancelled) setData(sessions);
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

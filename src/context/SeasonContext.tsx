import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  parseStoredSeason,
  SEASON_STORAGE_KEY,
  type SeasonYear,
} from "../lib/seasonConfig";
import { fetchAvailableSeasons } from "../lib/fetchSchedule";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";

type SeasonContextValue = {
  year: SeasonYear;
  availableSeasons: SeasonYear[];
  /** Newest season in the data (may still be in progress). */
  latestSeason: SeasonYear;
  setYear: (year: SeasonYear) => void;
};

const SeasonContext = createContext<SeasonContextValue | null>(null);

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [availableSeasons, setAvailableSeasons] = useState<SeasonYear[]>([]);
  const [year, setYearState] = useState<SeasonYear | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    fetchAvailableSeasons()
      .then((seasons) => {
        if (cancelled) return;
        setAvailableSeasons(seasons);
        if (seasons.length > 0) {
          const stored = parseStoredSeason(
            window.localStorage.getItem(SEASON_STORAGE_KEY),
            seasons,
          );
          setYearState(stored);
        }
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

  const setYear = useCallback(
    (next: SeasonYear) => {
      if (!availableSeasons.includes(next)) return;
      setYearState(next);
      window.localStorage.setItem(SEASON_STORAGE_KEY, String(next));
    },
    [availableSeasons],
  );

  const value = useMemo((): SeasonContextValue | null => {
    if (year == null || availableSeasons.length === 0) return null;
    return {
      year,
      availableSeasons,
      latestSeason: availableSeasons[0],
      setYear,
    };
  }, [year, availableSeasons, setYear]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f14] text-zinc-100">
        <main className="max-w-6xl mx-auto px-4 py-8">
          <LoadingSkeleton />
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#0f0f14] text-zinc-100 flex items-center justify-center px-4">
        <ErrorMessage title="Could not load seasons" message={error} />
      </div>
    );
  }

  if (!value) {
    return (
      <div className="min-h-screen bg-[#0f0f14] text-zinc-100 flex items-center justify-center px-4">
        <p className="text-zinc-500">No season data found in the schedule mart.</p>
      </div>
    );
  }

  return (
    <SeasonContext.Provider value={value}>{children}</SeasonContext.Provider>
  );
}

export function useSeason(): SeasonContextValue {
  const ctx = useContext(SeasonContext);
  if (!ctx) {
    throw new Error("useSeason must be used within SeasonProvider");
  }
  return ctx;
}

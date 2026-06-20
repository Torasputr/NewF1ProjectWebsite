import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  AVAILABLE_SEASONS,
  SEASON_STORAGE_KEY,
  parseStoredSeason,
  type SeasonYear,
} from "../lib/seasonConfig";

type SeasonContextValue = {
  year: SeasonYear;
  setYear: (year: SeasonYear) => void;
};

const SeasonContext = createContext<SeasonContextValue | null>(null);

export function SeasonProvider({ children }: { children: ReactNode }) {
  const [year, setYearState] = useState<SeasonYear>(() =>
    parseStoredSeason(
      typeof window !== "undefined"
        ? window.localStorage.getItem(SEASON_STORAGE_KEY)
        : null,
    ),
  );

  const setYear = useCallback((next: SeasonYear) => {
    setYearState(next);
    window.localStorage.setItem(SEASON_STORAGE_KEY, String(next));
  }, []);

  const value = useMemo(() => ({ year, setYear }), [year, setYear]);

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

export { AVAILABLE_SEASONS };

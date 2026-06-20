export const AVAILABLE_SEASONS = [2026, 2025] as const;
export type SeasonYear = (typeof AVAILABLE_SEASONS)[number];
export const DEFAULT_SEASON: SeasonYear = 2026;
export const SEASON_STORAGE_KEY = "f1-pulse-season";

/** Mart files are season-agnostic (e.g. `2026.json` holds 2025 + 2026 rows).
 *  Always filter by `year` via `fetchSeasonMart` / `filterByYear` — never swap URLs. */
export function dataUrlForSeason(templateUrl: string, _year?: SeasonYear): string {
  return templateUrl;
}

export function isSeasonYear(value: unknown): value is SeasonYear {
  return (
    typeof value === "number" &&
    (AVAILABLE_SEASONS as readonly number[]).includes(value)
  );
}

export function parseStoredSeason(value: string | null): SeasonYear {
  const year = Number(value);
  return isSeasonYear(year) ? year : DEFAULT_SEASON;
}

export function filterByYear<T extends { year: number }>(
  rows: T[],
  year: SeasonYear,
): T[] {
  return rows.filter((row) => Number(row.year) === year);
}

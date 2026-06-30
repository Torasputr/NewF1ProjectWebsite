export type SeasonYear = number;

/** Unique season years from mart rows, newest first. */
export function extractSeasonYears(rows: { year: number }[]): SeasonYear[] {
  const years = new Set<number>();
  for (const row of rows) {
    const y = Number(row.year);
    if (Number.isFinite(y) && y >= 1950 && y <= 2100) {
      years.add(y);
    }
  }
  return [...years].sort((a, b) => b - a);
}

export const SEASON_STORAGE_KEY = "f1-pulse-season";

/** Mart files are season-agnostic (e.g. `2026.json` holds multiple seasons).
 *  Always filter by `year` via `fetchSeasonMart` / `filterByYear` — never swap URLs. */
export function dataUrlForSeason(
  templateUrl: string,
  _year?: SeasonYear,
): string {
  return templateUrl;
}

export function parseStoredSeason(
  value: string | null,
  availableSeasons: SeasonYear[],
): SeasonYear {
  if (availableSeasons.length === 0) {
    return new Date().getFullYear();
  }
  const year = Number(value);
  if (Number.isFinite(year) && availableSeasons.includes(year)) {
    return year;
  }
  return availableSeasons[0];
}

export function filterByYear<T extends { year: number }>(
  rows: T[],
  year: SeasonYear,
): T[] {
  return rows.filter((row) => Number(row.year) === year);
}

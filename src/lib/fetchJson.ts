import { parseNdjson } from "./parseSchedule";
import {
  dataUrlForSeason,
  filterByYear,
  type SeasonYear,
} from "./seasonConfig";

export async function fetchNdjson<T>(url: string, label: string): Promise<T[]> {
  const res = await fetch(url, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to load ${label}: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  return parseNdjson<T>(text);
}

/** Load a combined mart file and return rows for a single season only. */
export async function fetchSeasonMart<TRaw, T extends { year: number }>(
  templateUrl: string,
  label: string,
  year: SeasonYear,
  normalize: (raw: TRaw) => T,
): Promise<T[]> {
  const url = dataUrlForSeason(templateUrl, year);
  const rows = await fetchNdjson<TRaw>(url, label);
  return filterByYear(rows.map(normalize), year);
}

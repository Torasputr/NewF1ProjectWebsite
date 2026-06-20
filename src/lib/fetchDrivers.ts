import type { Driver } from "../types/driver";
import type { SessionResultRow } from "../types/sessionResults";
import { normalizeDriver } from "./normalizeDriver";
import { normalizeSessionResult } from "./normalizeSessionResult";
import { dedupeDriversForSeason } from "./driverUtils";
import { fetchSeasonMart } from "./fetchJson";
import { filterByYear, type SeasonYear } from "./seasonConfig";

const DRIVERS_URL = import.meta.env.VITE_DRIVERS_URL;
const SESSION_RESULTS_URL = import.meta.env.VITE_SESSION_RESULTS_URL;

if (!DRIVERS_URL) {
  throw new Error("VITE_DRIVERS_URL is not set");
}

function championshipPointsByDriver(
  results: SessionResultRow[],
  year: SeasonYear,
): Map<number, number> {
  const map = new Map<number, number>();

  for (const row of filterByYear(results, year)) {
    if (row.session_type !== "Race") continue;
    const points = row.points ?? 0;
    map.set(
      row.driver_number,
      (map.get(row.driver_number) ?? 0) + points,
    );
  }

  return map;
}

async function loadRaceResultsForDedupe(
  year: SeasonYear,
): Promise<Map<number, number>> {
  if (!SESSION_RESULTS_URL) return new Map();

  try {
    const rows = await fetchSeasonMart(
      SESSION_RESULTS_URL,
      "race results",
      year,
      normalizeSessionResult,
    );
    return championshipPointsByDriver(rows, year);
  } catch {
    return new Map();
  }
}

export async function fetchDrivers(year: SeasonYear): Promise<Driver[]> {
  const filtered = (
    await fetchSeasonMart(DRIVERS_URL, "drivers", year, normalizeDriver)
  ).filter((d) => d.team_name.length > 0);
  const sessionPoints = await loadRaceResultsForDedupe(year);
  return dedupeDriversForSeason(filtered, year, sessionPoints);
}

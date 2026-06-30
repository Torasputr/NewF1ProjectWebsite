import type { Driver } from "../types/driver";
import { normalizeDriver } from "./normalizeDriver";
import { dedupeDriversForSeason } from "./driverUtils";
import { fetchSeasonMart } from "./fetchJson";
import type { SeasonYear } from "./seasonConfig";

const DRIVER_STANDINGS_URL = import.meta.env.VITE_DRIVER_STANDINGS_URL;

if (!DRIVER_STANDINGS_URL) {
  throw new Error("VITE_DRIVER_STANDINGS_URL is not set");
}

export async function fetchDriverStandings(
  year: SeasonYear,
  latestSeason?: SeasonYear,
): Promise<Driver[]> {
  const rows = await fetchSeasonMart(
    DRIVER_STANDINGS_URL,
    "driver standings",
    year,
    normalizeDriver,
  );
  const seasonCompleted = latestSeason != null && year < latestSeason;
  return dedupeDriversForSeason(rows, year, undefined, seasonCompleted);
}

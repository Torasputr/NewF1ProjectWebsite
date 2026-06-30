import type { Driver } from "../types/driver";
import { normalizeDriver } from "./normalizeDriver";
import { dedupeDriversForSeason } from "./driverUtils";
import { fetchSeasonMart } from "./fetchJson";
import type { SeasonYear } from "./seasonConfig";

const DRIVERS_URL = import.meta.env.VITE_DRIVERS_URL;

if (!DRIVERS_URL) {
  throw new Error("VITE_DRIVERS_URL is not set");
}

export async function fetchDrivers(
  year: SeasonYear,
  latestSeason?: SeasonYear,
): Promise<Driver[]> {
  const filtered = (
    await fetchSeasonMart(DRIVERS_URL, "drivers", year, normalizeDriver)
  ).filter((d) => d.team_name.length > 0);
  const seasonCompleted = latestSeason != null && year < latestSeason;
  return dedupeDriversForSeason(filtered, year, undefined, seasonCompleted);
}

import type { ScheduleSession } from "../types/schedule";
import { normalizeSession } from "./normalizeSession";
import { fetchNdjson, fetchSeasonMart } from "./fetchJson";
import { extractSeasonYears, type SeasonYear } from "./seasonConfig";

const SCHEDULE_URL = import.meta.env.VITE_SCHEDULE_URL;

if (!SCHEDULE_URL) {
  throw new Error("VITE_SCHEDULE_URL is not set");
}

export async function fetchAvailableSeasons(): Promise<SeasonYear[]> {
  const rows = await fetchNdjson<ScheduleSession>(SCHEDULE_URL, "schedule");
  return extractSeasonYears(rows.map(normalizeSession));
}

export async function fetchSchedule(
  year: SeasonYear,
): Promise<ScheduleSession[]> {
  return fetchSeasonMart(SCHEDULE_URL, "schedule", year, normalizeSession);
}

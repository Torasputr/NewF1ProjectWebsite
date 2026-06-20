import type { ScheduleSession } from "../types/schedule";
import { normalizeSession } from "./normalizeSession";
import { fetchSeasonMart } from "./fetchJson";
import type { SeasonYear } from "./seasonConfig";

const SCHEDULE_URL = import.meta.env.VITE_SCHEDULE_URL;

if (!SCHEDULE_URL) {
  throw new Error("VITE_SCHEDULE_URL is not set");
}

export async function fetchSchedule(
  year: SeasonYear,
): Promise<ScheduleSession[]> {
  return fetchSeasonMart(SCHEDULE_URL, "schedule", year, normalizeSession);
}

import type { ScheduleSession } from "../types/schedule";
import { parseNdjson } from "./parseSchedule";
import { normalizeSession } from "./normalizeSession";

const SCHEDULE_URL = import.meta.env.VITE_SCHEDULE_URL;

if (!SCHEDULE_URL) {
  throw new Error("VITE_SCHEDULE_URL is not set");
}

export async function fetchSchedule(): Promise<ScheduleSession[]> {
  const res = await fetch(SCHEDULE_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to load schedule: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  return parseNdjson<ScheduleSession>(text).map(normalizeSession);
}

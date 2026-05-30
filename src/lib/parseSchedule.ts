import type { ScheduleSession } from "../types/schedule";

export function parseNdjson<T>(text: string): T[] {
  return text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as T);
}

// Convenience for schedule-only imports
export function parseScheduleNdjson(text: string): ScheduleSession[] {
  return parseNdjson<ScheduleSession>(text);
}

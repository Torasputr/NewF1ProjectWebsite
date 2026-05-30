import type { ScheduleSession } from "../types/schedule";

export function normalizeSession(raw: ScheduleSession): ScheduleSession {
  return {
    ...raw,
    meeting_key: Number(raw.meeting_key),
    session_key: Number(raw.session_key),
    country_key: Number(raw.country_key),
    circuit_key: Number(raw.circuit_key),
    year: Number(raw.year),
    is_cancelled:
      typeof raw.is_cancelled === "string"
        ? raw.is_cancelled === "true"
        : Boolean(raw.is_cancelled),
  };
}

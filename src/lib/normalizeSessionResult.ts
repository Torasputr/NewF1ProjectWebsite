import type { SessionResultRow } from "../types/sessionResults";

export function normalizeSessionResult(
  raw: SessionResultRow,
): SessionResultRow {
  return {
    ...raw,
    meeting_key: Number(raw.meeting_key),
    session_key: Number(raw.session_key),
    year: Number(raw.year),
    position: Number(raw.position),
    driver_number: Number(raw.driver_number),
    number_of_laps:
      raw.number_of_laps == null ? null : Number(raw.number_of_laps),
    points: raw.points == null ? null : Number(raw.points),
    duration: raw.duration == null ? null : Number(raw.duration),
    dnf: raw.dnf === true || raw.dnf === ("true" as unknown as boolean),
    dns: raw.dns === true || raw.dns === ("true" as unknown as boolean),
    dsq: raw.dsq === true || raw.dsq === ("true" as unknown as boolean),
    gap_to_leader:
      raw.gap_to_leader === null || raw.gap_to_leader === ""
        ? null
        : typeof raw.gap_to_leader === "string" &&
            Number.isNaN(Number(raw.gap_to_leader))
          ? raw.gap_to_leader
          : Number(raw.gap_to_leader),
    q1: raw.q1 == null ? null : Number(raw.q1),
    q2: raw.q2 == null ? null : Number(raw.q2),
    q3: raw.q3 == null ? null : Number(raw.q3),
    best_lap_time: raw.best_lap_time == null ? null : Number(raw.best_lap_time),
  };
}

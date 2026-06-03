import type { Driver } from "../types/driver";
import type { RaceWeekend } from "../types/schedule";
import type { SessionResultRow } from "../types/sessionResults";
import { parseSessionDate } from "./scheduleUtils";
import {
  formatGap,
  formatLapTime,
  formatRaceTime,
  isQualifyingResult,
} from "./sessionResultUtils";

export type DriverSessionResult = SessionResultRow & {
  meeting_name: string;
};

export type DriverPerformanceStats = {
  championshipPoints: number;
  championshipPosition: number | null;
  raceStarts: number;
  pointsFromRaces: number;
  bestFinish: number | null;
  podiums: number;
  wins: number;
  poles: number;
  dnfs: number;
};

export function buildMeetingNameMap(
  weekends: RaceWeekend[],
): Map<number, string> {
  return new Map(weekends.map((w) => [w.meeting_key, w.meeting_name]));
}

export function getDriverSessionResults(
  results: SessionResultRow[],
  driverNumber: number,
  meetingNames: Map<number, string>,
): DriverSessionResult[] {
  return results
    .filter((r) => r.driver_number === driverNumber)
    .filter(
      (r) =>
        r.session_type === "Race" || r.session_type === "Qualifying",
    )
    .map((r) => ({
      ...r,
      meeting_name:
        meetingNames.get(r.meeting_key) ??
        `Round ${r.meeting_key}`,
    }))
    .sort(
      (a, b) =>
        parseSessionDate(String(b.date_start)).getTime() -
        parseSessionDate(String(a.date_start)).getTime(),
    );
}

export function computeDriverPerformanceStats(
  sessions: DriverSessionResult[],
  driver: Driver,
  championshipPosition: number | null,
): DriverPerformanceStats {
  const races = sessions.filter((r) => r.session_type === "Race");
  const qualis = sessions.filter((r) => r.session_type === "Qualifying");
  const finishedRaces = races.filter((r) => !r.dns && !r.dsq);

  return {
    championshipPoints: driver.total_points,
    championshipPosition,
    raceStarts: races.length,
    pointsFromRaces: races.reduce((sum, r) => sum + (r.points ?? 0), 0),
    bestFinish:
      finishedRaces.length > 0
        ? Math.min(...finishedRaces.map((r) => r.position))
        : null,
    podiums: finishedRaces.filter((r) => r.position <= 3).length,
    wins: finishedRaces.filter((r) => r.position === 1).length,
    poles: qualis.filter((r) => r.position === 1).length,
    dnfs: sessions.filter((r) => r.dnf).length,
  };
}

export function formatDriverSessionResult(row: DriverSessionResult): string {
  if (isQualifyingResult(row)) {
    return formatLapTime(row.best_lap_time ?? null);
  }
  if (row.position === 1) {
    return formatRaceTime(row.duration ?? null);
  }
  return formatGap(row.gap_to_leader ?? null, row.position);
}

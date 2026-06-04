import type { RaceWeekend } from "../types/schedule";
import type { DriverSessionResult } from "./driverPerformanceUtils";
import { getSessionHistoryCategory } from "./driverPerformanceUtils";
import { parseSessionDate } from "./scheduleUtils";

export type DriverRacePointEntry = {
  meeting_key: number;
  session_key: number;
  session_name: string;
  meeting_name: string;
  circuit_short_name: string;
  date_start: string;
  position: number;
  points: number;
  isSprint: boolean;
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
};

export type RacePointsSummary = {
  sessionCount: number;
  totalPoints: number;
  raceCount: number;
  sprintCount: number;
  averageRacePoints: number | null;
  averageSprintPoints: number | null;
  best: DriverRacePointEntry | null;
  worst: DriverRacePointEntry | null;
};

function averagePoints(entries: DriverRacePointEntry[]): number | null {
  if (entries.length === 0) return null;
  const total = entries.reduce((sum, row) => sum + row.points, 0);
  return Math.round((total / entries.length) * 10) / 10;
}

export function buildMeetingCircuitMap(
  weekends: RaceWeekend[],
): Map<number, string> {
  return new Map(weekends.map((w) => [w.meeting_key, w.circuit_short_name]));
}

export function getDriverRaceSessionPointsSeries(
  sessions: DriverSessionResult[],
  circuitByMeeting: Map<number, string>,
): DriverRacePointEntry[] {
  return sessions
    .filter((row) => {
      const cat = getSessionHistoryCategory(row);
      return cat === "race" || cat === "sprint";
    })
    .map((row) => {
      const isSprint = getSessionHistoryCategory(row) === "sprint";
      return {
        meeting_key: row.meeting_key,
        session_key: row.session_key,
        session_name: row.session_name,
        meeting_name: row.meeting_name,
        circuit_short_name:
          circuitByMeeting.get(row.meeting_key) ?? row.meeting_name,
        date_start: String(row.date_start),
        position: row.position,
        points: row.points ?? 0,
        isSprint,
        dnf: row.dnf,
        dns: row.dns,
        dsq: row.dsq,
      };
    })
    .sort(
      (a, b) =>
        parseSessionDate(a.date_start).getTime() -
        parseSessionDate(b.date_start).getTime(),
    );
}

export function computeRacePointsSummary(
  series: DriverRacePointEntry[],
): RacePointsSummary {
  if (series.length === 0) {
    return {
      sessionCount: 0,
      totalPoints: 0,
      raceCount: 0,
      sprintCount: 0,
      averageRacePoints: null,
      averageSprintPoints: null,
      best: null,
      worst: null,
    };
  }

  const races = series.filter((row) => !row.isSprint);
  const sprints = series.filter((row) => row.isSprint);
  const totalPoints = series.reduce((sum, row) => sum + row.points, 0);
  let best = series[0];
  let worst = series[0];

  for (const row of series) {
    if (row.points > best.points) best = row;
    if (row.points < worst.points) worst = row;
  }

  return {
    sessionCount: series.length,
    totalPoints,
    raceCount: races.length,
    sprintCount: sprints.length,
    averageRacePoints: averagePoints(races),
    averageSprintPoints: averagePoints(sprints),
    best,
    worst,
  };
}

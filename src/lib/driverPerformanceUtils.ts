import type { Driver } from "../types/driver";
import type { RaceWeekend } from "../types/schedule";
import type { SessionResultRow } from "../types/sessionResults";
import { parseSessionDate } from "./scheduleUtils";
import { pointsForFinishPosition } from "./sessionPointsUtils";
import { formatRaceTime } from "./sessionResultUtils";

export type DriverSessionResult = SessionResultRow & {
  meeting_name: string;
};

export type SessionHistoryCategory =
  | "race"
  | "sprint"
  | "qualifying"
  | "practice";

export const SESSION_HISTORY_FILTERS: {
  id: SessionHistoryCategory;
  label: string;
}[] = [
  { id: "race", label: "Races" },
  { id: "sprint", label: "Sprints" },
  { id: "qualifying", label: "Qualifying" },
  { id: "practice", label: "Practice" },
];

export function getSessionHistoryCategory(
  row: SessionResultRow,
): SessionHistoryCategory {
  if (row.session_type === "Practice") return "practice";
  if (row.session_type === "Qualifying") return "qualifying";
  if (row.session_type === "Race" && row.session_name === "Sprint") {
    return "sprint";
  }
  if (row.session_type === "Race") return "race";
  return "race";
}

export function filterSessionsByCategories(
  sessions: DriverSessionResult[],
  active: Record<SessionHistoryCategory, boolean>,
): DriverSessionResult[] {
  return sessions.filter((row) => active[getSessionHistoryCategory(row)]);
}

export const DEFAULT_SESSION_HISTORY_FILTERS: Record<
  SessionHistoryCategory,
  boolean
> = {
  race: true,
  sprint: true,
  qualifying: true,
  practice: true,
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
        r.session_type === "Race" ||
        r.session_type === "Qualifying" ||
        r.session_type === "Practice",
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
  const seconds = row.duration ?? row.best_lap_time ?? null;
  return formatRaceTime(seconds);
}

export type QualiRaceConversion = "better" | "similar" | "worse";

export type QualiCompareMode = "places" | "points";

export type QualiRaceComparison = {
  qualiPosition: number;
  racePosition: number;
  /** Positive = gained places vs qualifying grid. */
  placesDelta: number;
  placesConversion: QualiRaceConversion;
  actualPoints: number;
  /** Points if they had finished in their quali position. */
  gridPoints: number;
  /** actualPoints − gridPoints */
  pointsDelta: number;
  pointsConversion: QualiRaceConversion;
};

function conversionFromDelta(delta: number): QualiRaceConversion {
  if (delta > 0) return "better";
  if (delta === 0) return "similar";
  return "worse";
}

export function isSprintQualifyingSession(row: SessionResultRow): boolean {
  return (
    row.session_type === "Qualifying" &&
    row.session_name.toLowerCase().includes("sprint")
  );
}

export type QualiPositionByMeeting = {
  grandPrix: Map<number, number>;
  sprint: Map<number, number>;
};

export function buildQualiPositionIndex(
  sessions: DriverSessionResult[],
): QualiPositionByMeeting {
  const grandPrix = new Map<number, number>();
  const sprint = new Map<number, number>();

  for (const row of sessions) {
    if (row.session_type !== "Qualifying") continue;
    if (isSprintQualifyingSession(row)) {
      sprint.set(row.meeting_key, row.position);
    } else {
      grandPrix.set(row.meeting_key, row.position);
    }
  }

  return { grandPrix, sprint };
}

export function compareQualiToRace(
  row: DriverSessionResult,
  qualiIndex: QualiPositionByMeeting,
): QualiRaceComparison | null {
  const category = getSessionHistoryCategory(row);
  if (category !== "race" && category !== "sprint") return null;

  const qualiPosition =
    category === "sprint"
      ? (qualiIndex.sprint.get(row.meeting_key) ??
        qualiIndex.grandPrix.get(row.meeting_key))
      : qualiIndex.grandPrix.get(row.meeting_key);

  if (qualiPosition == null) return null;

  const racePosition = row.position;
  const placesDelta = qualiPosition - racePosition;
  const sessionCategory = category as "race" | "sprint";
  const actualPoints = row.points ?? 0;
  const gridPoints = pointsForFinishPosition(qualiPosition, sessionCategory);
  const pointsDelta = actualPoints - gridPoints;

  return {
    qualiPosition,
    racePosition,
    placesDelta,
    placesConversion: conversionFromDelta(placesDelta),
    actualPoints,
    gridPoints,
    pointsDelta,
    pointsConversion: conversionFromDelta(pointsDelta),
  };
}

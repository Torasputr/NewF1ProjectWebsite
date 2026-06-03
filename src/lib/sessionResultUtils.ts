import type { Driver } from "../types/driver";
import type {
  SessionResultRow,
  SessionResultsGroup,
} from "../types/sessionResults";
import type { RaceWeekend } from "../types/schedule";

export function getResultsByMeeting(
  results: SessionResultRow[],
  meetingKey: number,
): SessionResultRow[] {
  return results
    .filter((r) => r.meeting_key === meetingKey)
    .sort((a, b) => a.position - b.position);
}

export function groupResultsBySession(
  rows: SessionResultRow[],
): SessionResultsGroup[] {
  const map = new Map<number, SessionResultRow[]>();

  for (const row of rows) {
    if (!map.has(row.session_key)) map.set(row.session_key, []);
    map.get(row.session_key)!.push(row);
  }

  return Array.from(map.entries())
    .map(([session_key, sessionRows]) => {
      const first = sessionRows[0];
      return {
        session_key,
        session_name: first.session_name,
        session_type: first.session_type,
        date_start: String(first.date_start),
        rows: [...sessionRows].sort((a, b) => a.position - b.position),
      };
    })
    .sort(
      (a, b) =>
        new Date(
          a.date_start.replace(" UTC", "Z").replace(" ", "T"),
        ).getTime() -
        new Date(b.date_start.replace(" UTC", "Z").replace(" ", "T")).getTime(),
    );
}

export function buildDriverMap(drivers: Driver[]): Map<number, Driver> {
  return new Map(drivers.map((d) => [d.driver_number, d]));
}

export function formatGap(
  gap: number | string | null,
  position: number,
): string {
  if (position === 1) return "—";
  if (gap === null || gap === undefined) return "—";
  if (typeof gap === "string") return gap;
  if (gap === 0) return "—";
  return `+${gap.toFixed(3)}s`;
}

export function isQualifyingResult(row: SessionResultRow): boolean {
  return row.session_type === "Qualifying";
}

export function formatLapTime(seconds: number | null | undefined): string {
  return formatRaceTime(seconds ?? null);
}

export function formatRaceTime(seconds: number | null): string {
  if (seconds == null || Number.isNaN(seconds)) return "—";
  const totalMs = Math.round(seconds * 1000);
  const h = Math.floor(totalMs / 3_600_000);
  const m = Math.floor((totalMs % 3_600_000) / 60_000);
  const s = Math.floor((totalMs % 60_000) / 1000);
  const ms = totalMs % 1000;

  if (h > 0) {
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
  }
  return `${m}:${String(s).padStart(2, "0")}.${String(ms).padStart(3, "0")}`;
}

export function driverStatus(row: SessionResultRow): string | null {
  if (row.dsq) return "DSQ";
  if (row.dns) return "DNS";
  if (row.dnf) return "DNF";
  return null;
}

export type PodiumEntry = {
  position: number;
  driver_number: number;
  full_name: string;
  name_acronym: string;
  headshot_url: string;
  team_colour: string;
  status: string | null;
  duration: number | null;
  gap_to_leader: number | string | null;
};

export function formatPodiumRaceTime(entry: PodiumEntry): string {
  if (entry.status) return entry.status;
  if (entry.position === 1) {
    return formatRaceTime(entry.duration);
  }
  return formatGap(entry.gap_to_leader, entry.position);
}
/** Main Sunday race (not Sprint) */
export function getMainRaceSessionKey(weekend: RaceWeekend): number | null {
  const race = weekend.sessions.find(
    (s) =>
      s.session_type === "Race" && s.session_name === "Race" && !s.is_cancelled,
  );
  return race?.session_key ?? null;
}
export function getPodiumForWeekend(
  results: SessionResultRow[],
  weekend: RaceWeekend,
  drivers: Driver[],
): PodiumEntry[] {
  const sessionKey = getMainRaceSessionKey(weekend);
  if (!sessionKey) return [];
  const driverMap = buildDriverMap(drivers);
  return results
    .filter(
      (r) =>
        r.session_type === "Race" &&
        r.meeting_key === weekend.meeting_key &&
        r.session_key === sessionKey &&
        r.position >= 1 &&
        r.position <= 3,
    )
    .sort((a, b) => a.position - b.position)
    .map((row) => {
      const driver = driverMap.get(row.driver_number);
      return {
        position: row.position,
        driver_number: row.driver_number,
        full_name: driver?.full_name ?? `Driver ${row.driver_number}`,
        name_acronym: driver?.name_acronym ?? "—",
        headshot_url: driver?.headshot_url ?? "",
        team_colour: driver?.team_colour ?? "#71717a",
        status: driverStatus(row),
        duration: row.duration ?? null,
        gap_to_leader: row.gap_to_leader ?? null,
      };
    });
}
export function buildPodiumByMeeting(
  results: SessionResultRow[],
  weekends: RaceWeekend[],
  drivers: Driver[],
): Map<number, PodiumEntry[]> {
  const map = new Map<number, PodiumEntry[]>();
  const unique = [
    ...new Map(drivers.map((d) => [d.driver_number, d])).values(),
  ];
  for (const weekend of weekends) {
    const podium = getPodiumForWeekend(results, weekend, unique);
    if (podium.length > 0) {
      map.set(weekend.meeting_key, podium);
    }
  }
  return map;
}

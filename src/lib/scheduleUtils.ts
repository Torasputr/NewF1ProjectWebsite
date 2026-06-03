import type { ScheduleSession, RaceWeekend } from "../types/schedule";

/** Parse schedule/session timestamps (stored as UTC) into a Date instant. */
export function parseSessionDate(value: string): Date {
  const v = value.trim();
  if (!v) return new Date(NaN);
  if (v.includes(" UTC")) {
    return new Date(v.replace(" UTC", "Z").replace(" ", "T"));
  }
  if (/[zZ]$/.test(v) || /[+-]\d{2}:\d{2}$/.test(v)) {
    return new Date(v.includes("T") ? v : v.replace(" ", "T"));
  }
  const iso = v.includes("T") ? v : v.replace(" ", "T");
  return new Date(`${iso}Z`);
}

export function groupByMeeting(sessions: ScheduleSession[]): RaceWeekend[] {
  const map = new Map<number, ScheduleSession[]>();

  for (const s of sessions) {
    if (!map.has(s.meeting_key)) map.set(s.meeting_key, []);
    map.get(s.meeting_key)!.push(s);
  }

  return Array.from(map.entries())
    .map(([meeting_key, list]) => {
      const sorted = [...list].sort(
        (a, b) =>
          parseSessionDate(a.date_start).getTime() -
          parseSessionDate(b.date_start).getTime(),
      );
      const first = sorted[0];
      const dates = sorted.map((s) => parseSessionDate(s.date_start));

      return {
        meeting_key,
        meeting_name: first.meeting_name,
        country_name: first.country_name,
        country_flag: first.country_flag,
        location: first.location,
        circuit_short_name: first.circuit_short_name,
        circuit_image: first.circuit_image,
        sessions: sorted,
        weekendStart: new Date(Math.min(...dates.map((d) => d.getTime()))),
        weekendEnd: new Date(
          Math.max(
            ...sorted.map((s) => parseSessionDate(s.date_end).getTime()),
          ),
        ),
      };
    })
    .sort((a, b) => a.weekendStart.getTime() - b.weekendStart.getTime());
}

export function isTestingWeekend(weekend: RaceWeekend): boolean {
  return weekend.meeting_name.toLowerCase().includes("testing");
}

export function getRaceWeekends(weekends: RaceWeekend[]): RaceWeekend[] {
  return weekends.filter((w) => !isTestingWeekend(w));
}

export function isMeetingCancelled(weekend: RaceWeekend): boolean {
  const mainRace = weekend.sessions.find(
    (s) => s.session_type === "Race" && s.session_name === "Race",
  );
  if (mainRace) return mainRace.is_cancelled;
  return (
    weekend.sessions.length > 0 && weekend.sessions.every((s) => s.is_cancelled)
  );
}

export type WeekendStatus =
  | "completed"
  | "in_progress"
  | "upcoming"
  | "cancelled";

export function getWeekendStatus(
  weekend: RaceWeekend,
  now = Date.now(),
): WeekendStatus {
  if (isMeetingCancelled(weekend)) return "cancelled";
  if (weekend.weekendEnd.getTime() < now) return "completed";
  if (weekend.weekendStart.getTime() > now) return "upcoming";
  return "in_progress";
}

/** Most recent finished race weekend (chronological order). */
export function getLatestCompletedRaceWeekend(
  raceWeekends: RaceWeekend[],
  now = Date.now(),
): RaceWeekend | null {
  const completed = raceWeekends.filter(
    (w) => w.weekendEnd.getTime() < now && !isMeetingCancelled(w),
  );
  return completed[completed.length - 1] ?? null;
}

export function countCancelledMeetings(weekends: RaceWeekend[]): number {
  return getRaceWeekends(weekends).filter(isMeetingCancelled).length;
}

export function getNextSession(
  sessions: ScheduleSession[],
): ScheduleSession | null {
  const now = Date.now();
  const upcoming = sessions
    .filter(
      (s) => !s.is_cancelled && parseSessionDate(s.date_start).getTime() > now,
    )
    .sort(
      (a, b) =>
        parseSessionDate(a.date_start).getTime() -
        parseSessionDate(b.date_start).getTime(),
    );
  return upcoming[0] ?? null;
}

export function getLiveSession(
  sessions: ScheduleSession[],
): ScheduleSession | null {
  const now = Date.now();
  return (
    sessions.find((s) => {
      if (s.is_cancelled) return false;
      const start = parseSessionDate(s.date_start).getTime();
      const end = parseSessionDate(s.date_end).getTime();
      return start <= now && now <= end;
    }) ?? null
  );
}

export function getAnchorWeekendIndex(
  raceWeekends: RaceWeekend[],
  nextSession: ScheduleSession | null,
  liveSession: ScheduleSession | null,
): number {
  const active = liveSession ?? nextSession;
  if (active) {
    const idx = raceWeekends.findIndex(
      (w) => w.meeting_key === active.meeting_key,
    );
    if (idx >= 0) return idx;
  }
  const now = Date.now();
  const upcomingIdx = raceWeekends.findIndex(
    (w) => w.weekendEnd.getTime() >= now,
  );
  return upcomingIdx >= 0 ? upcomingIdx : Math.max(0, raceWeekends.length - 1);
}

export function getAdjacentWeekends(
  raceWeekends: RaceWeekend[],
  anchorIndex: number,
): {
  previous: RaceWeekend | null;
  current: RaceWeekend | null;
  next: RaceWeekend | null;
} {
  const current = raceWeekends[anchorIndex] ?? null;
  const previous = anchorIndex > 0 ? raceWeekends[anchorIndex - 1]! : null;
  const next =
    anchorIndex < raceWeekends.length - 1
      ? raceWeekends[anchorIndex + 1]!
      : null;
  return { previous, current, next };
}

export type DashboardStats = {
  drivers: number;
  rounds: number;
  roundsLeft: number;
  cancelledMeetings: number;
};

export function computeDashboardStats(
  raceWeekends: RaceWeekend[],
  driverCount: number,
): DashboardStats {
  const now = Date.now();
  return {
    drivers: driverCount,
    rounds: raceWeekends.length,
    roundsLeft: raceWeekends.filter(
      (w) => w.weekendEnd.getTime() >= now && !isMeetingCancelled(w),
    ).length,
    cancelledMeetings: countCancelledMeetings(raceWeekends),
  };
}

export function sessionShortLabel(type: string, name: string): string {
  if (name.toLowerCase().includes("sprint qualifying")) return "SQ";
  if (type === "Practice") return name.replace("Practice ", "FP") || "FP";
  if (type === "Qualifying") return "Q";
  if (type === "Race" && name === "Sprint") return "S";
  if (type === "Race") return "R";
  return name.slice(0, 3).toUpperCase();
}

/** Race / quali rows are clickable only after the session has ended. */
export function sessionHasResults(session: ScheduleSession): boolean {
  if (session.is_cancelled) return false;
  const isResultSession =
    session.session_type === "Race" || session.session_type === "Qualifying";
  if (!isResultSession) return false;
  const ended = parseSessionDate(session.date_end).getTime() < Date.now();
  return ended;
}

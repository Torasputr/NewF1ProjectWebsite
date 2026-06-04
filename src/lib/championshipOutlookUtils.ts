import type { ConstructorStanding } from "../types/constructorStanding";
import type { Driver } from "../types/driver";
import type { RaceWeekend, ScheduleSession } from "../types/schedule";
import { sortConstructorStandings } from "./constructorUtils";
import { uniqueDrivers } from "./driverUtils";
import { maxConstructorPointsForSession } from "./sessionPointsUtils";
import {
  breakdownRemainingRounds,
  getRaceWeekends,
  isMeetingCancelled,
  sessionHasResults,
  type RemainingRoundsBreakdown,
} from "./scheduleUtils";

export const MAX_GRAND_PRIX_POINTS = 25;
export const MAX_SPRINT_POINTS = 8;

export function scoringSessionMaxPoints(session: ScheduleSession): number {
  if (session.is_cancelled) return 0;
  if (session.session_type === "Race" && session.session_name === "Race") {
    return MAX_GRAND_PRIX_POINTS;
  }
  if (session.session_type === "Race" && session.session_name === "Sprint") {
    return MAX_SPRINT_POINTS;
  }
  return 0;
}

export function meetingMaxPoints(weekend: RaceWeekend): number {
  return weekend.sessions.reduce(
    (sum, session) => sum + scoringSessionMaxPoints(session),
    0,
  );
}

export function meetingMaxConstructorPoints(weekend: RaceWeekend): number {
  return weekend.sessions.reduce(
    (sum, session) => sum + maxConstructorPointsForSession(session),
    0,
  );
}

/** Meeting still has championship points available (main race not finished). */
export function isMeetingRemaining(weekend: RaceWeekend): boolean {
  if (isMeetingCancelled(weekend)) return false;

  const mainRace = weekend.sessions.find(
    (s) => s.session_type === "Race" && s.session_name === "Race",
  );

  if (mainRace) return !sessionHasResults(mainRace);

  const sprintOnly = weekend.sessions.find(
    (s) => s.session_type === "Race" && s.session_name === "Sprint",
  );
  if (sprintOnly) return !sessionHasResults(sprintOnly);

  return false;
}

export function getRemainingRaceWeekends(weekends: RaceWeekend[]): RaceWeekend[] {
  return getRaceWeekends(weekends).filter(isMeetingRemaining);
}

export type ChampionshipOutlook = {
  leader: Driver;
  challenger: Driver;
  challengerPosition: number;
  isLeader: boolean;
  gapToLeader: number;
  secondPlace: Driver | null;
  leadOverSecond: number | null;
  remainingMeetings: RaceWeekend[];
  remainingRounds: RemainingRoundsBreakdown;
  maxRemainingPoints: number;
  canWin: boolean;
  pointsNeeded: number;
};

export function computeChampionshipOutlook(
  challenger: Driver,
  drivers: Driver[],
  weekends: RaceWeekend[],
): ChampionshipOutlook | null {
  const sorted = uniqueDrivers(drivers);
  if (sorted.length === 0) return null;

  const leader = sorted[0];
  const secondPlace = sorted[1] ?? null;
  const challengerPosition =
    sorted.findIndex((d) => d.driver_number === challenger.driver_number) + 1;

  if (challengerPosition === 0) return null;

  const isLeader = leader.driver_number === challenger.driver_number;
  const gapToLeader = leader.total_points - challenger.total_points;
  const remainingMeetings = getRemainingRaceWeekends(weekends);
  const remainingRounds = breakdownRemainingRounds(remainingMeetings);
  const maxRemainingPoints = remainingMeetings.reduce(
    (sum, weekend) => sum + meetingMaxPoints(weekend),
    0,
  );

  const canWin =
    isLeader ||
    challenger.total_points + maxRemainingPoints > leader.total_points;
  const pointsNeeded = isLeader ? 0 : gapToLeader + 1;

  const leadOverSecond =
    isLeader && secondPlace
      ? challenger.total_points - secondPlace.total_points
      : null;

  return {
    leader,
    challenger,
    challengerPosition,
    isLeader,
    gapToLeader,
    secondPlace,
    leadOverSecond,
    remainingMeetings,
    remainingRounds,
    maxRemainingPoints,
    canWin,
    pointsNeeded,
  };
}

export type ConstructorChampionshipOutlook = {
  leader: ConstructorStanding;
  challenger: ConstructorStanding;
  challengerPosition: number;
  isLeader: boolean;
  gapToLeader: number;
  secondPlace: ConstructorStanding | null;
  leadOverSecond: number | null;
  remainingMeetings: RaceWeekend[];
  remainingRounds: RemainingRoundsBreakdown;
  maxRemainingPoints: number;
  canWin: boolean;
  pointsNeeded: number;
};

export function computeConstructorChampionshipOutlook(
  challengerTeamName: string,
  standings: ConstructorStanding[],
  weekends: RaceWeekend[],
): ConstructorChampionshipOutlook | null {
  const sorted = sortConstructorStandings(standings);
  if (sorted.length === 0) return null;

  const challenger = sorted.find((s) => s.team_name === challengerTeamName);
  if (!challenger) return null;

  const leader = sorted[0];
  const secondPlace = sorted[1] ?? null;
  const challengerPosition =
    sorted.findIndex((s) => s.team_name === challengerTeamName) + 1;

  const isLeader = leader.team_name === challenger.team_name;
  const gapToLeader = leader.total_points - challenger.total_points;
  const remainingMeetings = getRemainingRaceWeekends(weekends);
  const remainingRounds = breakdownRemainingRounds(remainingMeetings);
  const maxRemainingPoints = remainingMeetings.reduce(
    (sum, weekend) => sum + meetingMaxConstructorPoints(weekend),
    0,
  );

  const canWin =
    isLeader ||
    challenger.total_points + maxRemainingPoints > leader.total_points;
  const pointsNeeded = isLeader ? 0 : gapToLeader + 1;

  const leadOverSecond =
    isLeader && secondPlace
      ? challenger.total_points - secondPlace.total_points
      : null;

  return {
    leader,
    challenger,
    challengerPosition,
    isLeader,
    gapToLeader,
    secondPlace,
    leadOverSecond,
    remainingMeetings,
    remainingRounds,
    maxRemainingPoints,
    canWin,
    pointsNeeded,
  };
}

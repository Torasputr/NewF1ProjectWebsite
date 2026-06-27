import { describe, expect, it } from "vitest";
import {
  computeChampionshipOutlook,
  computeConstructorChampionshipOutlook,
  meetingMaxPoints,
  scoringSessionMaxPoints,
} from "./championshipOutlookUtils";
import type { RaceWeekend, ScheduleSession } from "../types/schedule";
import { mockDriver, mockStanding } from "../test/fixtures";

function mockWeekend(
  sessions: ScheduleSession[],
  meetingKey = 1,
): RaceWeekend {
  return {
    meeting_key: meetingKey,
    meeting_name: "Test GP",
    country_name: "Test",
    country_flag: "",
    location: "Test",
    circuit_short_name: "TST",
    circuit_image: "",
    sessions,
    weekendStart: new Date("2026-06-01T00:00:00Z"),
    weekendEnd: new Date("2026-06-03T00:00:00Z"),
  };
}

describe("scoringSessionMaxPoints", () => {
  it("returns 25 for grand prix and 8 for sprint", () => {
    expect(
      scoringSessionMaxPoints({
        session_type: "Race",
        session_name: "Race",
        is_cancelled: false,
      } as ScheduleSession),
    ).toBe(25);

    expect(
      scoringSessionMaxPoints({
        session_type: "Race",
        session_name: "Sprint",
        is_cancelled: false,
      } as ScheduleSession),
    ).toBe(8);
  });

  it("returns zero for cancelled or non-scoring sessions", () => {
    expect(
      scoringSessionMaxPoints({
        session_type: "Race",
        session_name: "Race",
        is_cancelled: true,
      } as ScheduleSession),
    ).toBe(0);

    expect(
      scoringSessionMaxPoints({
        session_type: "Qualifying",
        session_name: "Qualifying",
        is_cancelled: false,
      } as ScheduleSession),
    ).toBe(0);
  });
});

describe("meetingMaxPoints", () => {
  it("sums race and sprint max points", () => {
    const weekend = mockWeekend([
      {
        session_type: "Race",
        session_name: "Sprint",
        is_cancelled: false,
      } as ScheduleSession,
      {
        session_type: "Race",
        session_name: "Race",
        is_cancelled: false,
      } as ScheduleSession,
    ]);

    expect(meetingMaxPoints(weekend)).toBe(33);
  });
});

describe("computeChampionshipOutlook", () => {
  const drivers = [
    mockDriver({ driver_number: 1, total_points: 200 }),
    mockDriver({ driver_number: 44, total_points: 150 }),
  ];

  it("returns null when challenger is not in the grid", () => {
    const challenger = mockDriver({ driver_number: 99, total_points: 10 });
    expect(computeChampionshipOutlook(challenger, drivers, [])).toBeNull();
  });

  it("marks leader and computes gap for challenger", () => {
    const challenger = mockDriver({ driver_number: 44, total_points: 150 });
    const outlook = computeChampionshipOutlook(challenger, drivers, []);

    expect(outlook?.isLeader).toBe(false);
    expect(outlook?.challengerPosition).toBe(2);
    expect(outlook?.gapToLeader).toBe(50);
    expect(outlook?.pointsNeeded).toBe(51);
  });

  it("marks leader outlook with zero points needed", () => {
    const leader = mockDriver({ driver_number: 1, total_points: 200 });
    const outlook = computeChampionshipOutlook(leader, drivers, []);

    expect(outlook?.isLeader).toBe(true);
    expect(outlook?.pointsNeeded).toBe(0);
    expect(outlook?.leadOverSecond).toBe(50);
  });
});

describe("computeConstructorChampionshipOutlook", () => {
  const standings = [
    mockStanding({ team_name: "Red Bull", total_points: 300 }),
    mockStanding({ team_name: "Ferrari", total_points: 220 }),
  ];

  it("returns null for unknown team", () => {
    expect(
      computeConstructorChampionshipOutlook("Unknown", standings, []),
    ).toBeNull();
  });

  it("computes challenger outlook", () => {
    const outlook = computeConstructorChampionshipOutlook(
      "Ferrari",
      standings,
      [],
    );

    expect(outlook?.challengerPosition).toBe(2);
    expect(outlook?.gapToLeader).toBe(80);
    expect(outlook?.pointsNeeded).toBe(81);
  });
});

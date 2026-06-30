import { describe, expect, it } from "vitest";
import {
  dedupeDriversForSeason,
  filterDrivers,
  findDriverByNumber,
  getChampionshipPosition,
  getTopDriversByPoints,
  groupByTeam,
  mergeRosterWithStandings,
  uniqueDrivers,
} from "./driverUtils";
import { mockDriver } from "../test/fixtures";

describe("uniqueDrivers", () => {
  it("sorts by points descending then driver number", () => {
    const drivers = [
      mockDriver({ driver_number: 44, total_points: 100 }),
      mockDriver({ driver_number: 1, total_points: 150 }),
      mockDriver({ driver_number: 16, total_points: 100 }),
    ];

    expect(uniqueDrivers(drivers).map((d) => d.driver_number)).toEqual([
      1, 16, 44,
    ]);
  });
});

describe("mergeRosterWithStandings", () => {
  it("overlays standings points onto roster profiles", () => {
    const roster = [
      mockDriver({
        driver_number: 1,
        full_name: "Max Verstappen",
        total_points: 0,
      }),
    ];
    const standings = [
      mockDriver({ driver_number: 1, full_name: "", total_points: 120 }),
    ];

    const merged = mergeRosterWithStandings(roster, standings);
    expect(merged).toHaveLength(1);
    expect(merged[0].full_name).toBe("Max Verstappen");
    expect(merged[0].total_points).toBe(120);
  });

  it("keeps standings-only rows when roster is missing", () => {
    const standings = [
      mockDriver({ driver_number: 99, full_name: "Unknown", total_points: 5 }),
    ];

    expect(mergeRosterWithStandings([], standings)).toHaveLength(1);
  });
});

describe("dedupeDriversForSeason", () => {
  it("returns a single row unchanged", () => {
    const driver = mockDriver({ driver_number: 1, total_points: 50 });
    expect(dedupeDriversForSeason([driver], 2026)).toEqual([driver]);
  });

  it("picks the row matching session points when provided", () => {
    const rows = [
      mockDriver({ driver_number: 1, total_points: 80 }),
      mockDriver({ driver_number: 1, total_points: 120 }),
    ];
    const sessionPoints = new Map([[1, 120]]);

    expect(dedupeDriversForSeason(rows, 2026, sessionPoints)[0].total_points).toBe(
      120,
    );
  });

  it("keeps the lower total for in-progress seasons when gap is large", () => {
    const rows = [
      mockDriver({ driver_number: 1, total_points: 50 }),
      mockDriver({ driver_number: 1, total_points: 200 }),
    ];

    expect(dedupeDriversForSeason(rows, 2026, undefined, false)[0].total_points).toBe(
      50,
    );
  });

  it("keeps the highest total for completed seasons", () => {
    const rows = [
      mockDriver({ driver_number: 1, total_points: 50 }),
      mockDriver({ driver_number: 1, total_points: 200 }),
    ];

    expect(dedupeDriversForSeason(rows, 2024, undefined, true)[0].total_points).toBe(
      200,
    );
  });
});

describe("groupByTeam", () => {
  it("orders teams by total points", () => {
    const drivers = [
      mockDriver({ driver_number: 1, team_name: "Red Bull", total_points: 100 }),
      mockDriver({ driver_number: 2, team_name: "Ferrari", total_points: 80 }),
      mockDriver({ driver_number: 3, team_name: "Ferrari", total_points: 70 }),
    ];

    const teams = groupByTeam(drivers);
    expect(teams[0][0]).toBe("Ferrari");
    expect(teams[1][0]).toBe("Red Bull");
    expect(teams[0][1]).toHaveLength(2);
  });
});

describe("filterDrivers", () => {
  const drivers = [
    mockDriver({ driver_number: 1, full_name: "Max Verstappen", team_name: "Red Bull" }),
    mockDriver({ driver_number: 16, full_name: "Charles Leclerc", team_name: "Ferrari" }),
  ];

  it("returns all drivers for empty query", () => {
    expect(filterDrivers(drivers, "")).toHaveLength(2);
  });

  it("matches name, team, acronym, and number", () => {
    expect(filterDrivers(drivers, "leclerc")).toHaveLength(1);
    expect(filterDrivers(drivers, "ferrari")).toHaveLength(1);
    expect(filterDrivers(drivers, "16")).toHaveLength(1);
  });
});

describe("getChampionshipPosition", () => {
  it("returns 1-based position", () => {
    const drivers = [
      mockDriver({ driver_number: 1, total_points: 100 }),
      mockDriver({ driver_number: 44, total_points: 80 }),
    ];

    expect(getChampionshipPosition(drivers, 44)).toBe(2);
    expect(getChampionshipPosition(drivers, 99)).toBeNull();
  });
});

describe("findDriverByNumber", () => {
  it("finds driver in sorted list", () => {
    const drivers = [
      mockDriver({ driver_number: 1, total_points: 100 }),
      mockDriver({ driver_number: 44, total_points: 80 }),
    ];

    expect(findDriverByNumber(drivers, 44)?.driver_number).toBe(44);
  });
});

describe("getTopDriversByPoints", () => {
  it("returns top N drivers", () => {
    const drivers = [
      mockDriver({ driver_number: 1, total_points: 100 }),
      mockDriver({ driver_number: 44, total_points: 80 }),
      mockDriver({ driver_number: 16, total_points: 60 }),
    ];

    expect(getTopDriversByPoints(drivers, 2).map((d) => d.driver_number)).toEqual([
      1, 44,
    ]);
  });
});

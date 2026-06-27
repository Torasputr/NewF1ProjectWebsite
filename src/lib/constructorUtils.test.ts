import { describe, expect, it } from "vitest";
import {
  constructorStandingsFromDrivers,
  sortConstructorStandings,
  teamColourByName,
} from "./constructorUtils";
import { mockDriver, mockStanding } from "../test/fixtures";

describe("constructorStandingsFromDrivers", () => {
  it("sums driver points per team", () => {
    const drivers = [
      mockDriver({ driver_number: 1, team_name: "Red Bull", total_points: 100 }),
      mockDriver({ driver_number: 22, team_name: "Red Bull", total_points: 40 }),
      mockDriver({ driver_number: 16, team_name: "Ferrari", total_points: 90 }),
    ];

    const standings = constructorStandingsFromDrivers(drivers);
    const redBull = standings.find((s) => s.team_name === "Red Bull");

    expect(redBull?.total_points).toBe(140);
    expect(standings).toHaveLength(2);
  });
});

describe("sortConstructorStandings", () => {
  it("sorts by points then team name", () => {
    const standings = [
      mockStanding({ team_name: "Ferrari", total_points: 100 }),
      mockStanding({ team_name: "Red Bull", total_points: 150 }),
      mockStanding({ team_name: "McLaren", total_points: 100 }),
    ];

    expect(sortConstructorStandings(standings).map((s) => s.team_name)).toEqual([
      "Red Bull",
      "Ferrari",
      "McLaren",
    ]);
  });
});

describe("teamColourByName", () => {
  it("maps each team to its first driver colour", () => {
    const drivers = [
      mockDriver({ team_name: "Red Bull", team_colour: "#3671C6" }),
      mockDriver({ driver_number: 22, team_name: "Red Bull", team_colour: "#111111" }),
      mockDriver({ driver_number: 16, team_name: "Ferrari", team_colour: "#E80020" }),
    ];

    const colours = teamColourByName(drivers);
    expect(colours.get("Red Bull")).toBe("#3671C6");
    expect(colours.get("Ferrari")).toBe("#E80020");
  });
});

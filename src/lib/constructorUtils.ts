import type { ConstructorStanding } from "../types/constructorStanding";
import type { Driver } from "../types/driver";
import { groupByTeam, uniqueDrivers } from "./driverUtils";

export function constructorStandingsFromDrivers(
  drivers: Driver[],
): ConstructorStanding[] {
  const teams = groupByTeam(uniqueDrivers(drivers));
  const year = drivers[0]?.year ?? 0;
  return teams.map(([team_name, list]) => ({
    team_name,
    total_points: list.reduce((sum, d) => sum + d.total_points, 0),
    year,
  }));
}

export function sortConstructorStandings(
  standings: ConstructorStanding[],
): ConstructorStanding[] {
  return [...standings].sort(
    (a, b) =>
      b.total_points - a.total_points ||
      a.team_name.localeCompare(b.team_name),
  );
}

export function teamColourByName(drivers: Driver[]): Map<string, string> {
  const map = new Map<string, string>();
  for (const d of uniqueDrivers(drivers)) {
    if (!map.has(d.team_name)) {
      map.set(d.team_name, d.team_colour);
    }
  }
  return map;
}

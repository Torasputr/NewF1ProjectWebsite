import type { Driver } from "../types/driver";
import type { SeasonYear } from "./seasonConfig";

/** Collapse duplicate mart rows for the same driver in one season. */
export function dedupeDriversForSeason(
  drivers: Driver[],
  year: SeasonYear,
  sessionPointsByDriver?: Map<number, number>,
): Driver[] {
  const groups = new Map<number, Driver[]>();

  for (const d of drivers) {
    const list = groups.get(d.driver_number) ?? [];
    list.push(d);
    groups.set(d.driver_number, list);
  }

  return Array.from(groups.values()).map((group) => {
    if (group.length === 1) return group[0];

    const expected = sessionPointsByDriver?.get(group[0].driver_number);
    if (expected != null) {
      const exact = group.find((d) => d.total_points === expected);
      if (exact) return exact;

      return group.reduce((best, d) =>
        Math.abs(d.total_points - expected) <
        Math.abs(best.total_points - expected)
          ? d
          : best,
      );
    }

    const sorted = [...group].sort((a, b) => a.total_points - b.total_points);
    const min = sorted[0].total_points;
    const max = sorted[sorted.length - 1].total_points;

    // Completed season snapshots — keep the highest total.
    if (year === 2025) {
      return sorted[sorted.length - 1];
    }

    // In-progress season — drop stale inflated totals when the gap is large.
    if (max > min * 1.5) {
      return sorted[0];
    }

    return sorted[sorted.length - 1];
  });
}

export function uniqueDrivers(drivers: Driver[]): Driver[] {
  return [...drivers].sort(
    (a, b) =>
      b.total_points - a.total_points || a.driver_number - b.driver_number,
  );
}

export function groupByTeam(drivers: Driver[]): [string, Driver[]][] {
  const map = new Map<string, Driver[]>();

  for (const d of drivers) {
    if (!map.has(d.team_name)) map.set(d.team_name, []);
    map.get(d.team_name)!.push(d);
  }

  for (const list of map.values()) {
    list.sort(
      (a, b) =>
        b.total_points - a.total_points || a.driver_number - b.driver_number,
    );
  }

  return [...map.entries()].sort(([, a], [, b]) => {
    const ptsA = a.reduce((sum, d) => sum + d.total_points, 0);
    const ptsB = b.reduce((sum, d) => sum + d.total_points, 0);
    const teamA = a[0]?.team_name ?? "";
    const teamB = b[0]?.team_name ?? "";
    return ptsB - ptsA || teamA.localeCompare(teamB);
  });
}

export function filterDrivers(drivers: Driver[], query: string): Driver[] {
  const q = query.trim().toLowerCase();
  if (!q) return drivers;
  return drivers.filter(
    (d) =>
      d.full_name.toLowerCase().includes(q) ||
      d.broadcast_name.toLowerCase().includes(q) ||
      d.name_acronym.toLowerCase().includes(q) ||
      d.team_name.toLowerCase().includes(q) ||
      String(d.driver_number).includes(q),
  );
}

export function getChampionshipPosition(
  drivers: Driver[],
  driverNumber: number,
): number | null {
  const sorted = uniqueDrivers(drivers);
  const index = sorted.findIndex((d) => d.driver_number === driverNumber);
  return index >= 0 ? index + 1 : null;
}

export function findDriverByNumber(
  drivers: Driver[],
  driverNumber: number,
): Driver | null {
  return uniqueDrivers(drivers).find((d) => d.driver_number === driverNumber) ?? null;
}

/** Top N by championship points */
export function getTopDriversByPoints(drivers: Driver[], limit = 5): Driver[] {
  return uniqueDrivers(drivers).slice(0, limit);
}

/** @deprecated use getTopDriversByPoints on home page */
export function getTopDriversByNumber(drivers: Driver[], limit = 5): Driver[] {
  return getTopDriversByPoints(drivers, limit);
}

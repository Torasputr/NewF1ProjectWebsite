import type { Driver } from "../types/driver";

export function uniqueDrivers(drivers: Driver[]): Driver[] {
  const byNumber = new Map<number, Driver>();

  for (const d of drivers) {
    const existing = byNumber.get(d.driver_number);
    if (!existing || d.total_points >= existing.total_points) {
      byNumber.set(d.driver_number, d);
    }
  }

  return Array.from(byNumber.values()).sort(
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

  // Teams ordered by combined points (highest first)
  return [...map.entries()].sort(([, a], [, b]) => {
    const ptsA = a.reduce((sum, d) => sum + d.total_points, 0);
    const ptsB = b.reduce((sum, d) => sum + d.total_points, 0);
    return ptsB - ptsA || a[0].team_name.localeCompare(b[0].team_name);
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

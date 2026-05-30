import type { Driver } from "../types/driver";

export function uniqueDrivers(drivers: Driver[]): Driver[] {
  const byNumber = new Map<number, Driver>();
  for (const d of drivers) {
    byNumber.set(d.driver_number, d);
  }
  return Array.from(byNumber.values()).sort(
    (a, b) => a.driver_number - b.driver_number,
  );
}

export function groupByTeam(drivers: Driver[]): [string, Driver[]][] {
  const map = new Map<string, Driver[]>();
  for (const d of drivers) {
    if (!map.has(d.team_name)) map.set(d.team_name, []);
    map.get(d.team_name)!.push(d);
  }
  for (const list of map.values()) {
    list.sort((a, b) => a.driver_number - b.driver_number);
  }
  return [...map.entries()].sort(([a], [b]) => a.localeCompare(b));
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

export function getTopDriversByNumber(drivers: Driver[], limit = 5): Driver[] {
  return uniqueDrivers(drivers).slice(0, limit);
}

import type { Driver } from "../types/driver";

export function normalizeDriver(raw: Driver): Driver {
  const colour = String(raw.team_colour ?? "").trim();
  return {
    ...raw,
    driver_number: Number(raw.driver_number),
    year: Number(raw.year),
    total_points: Number(raw.total_points ?? 0),
    team_colour: colour.startsWith("#") ? colour : `#${colour}`,
  };
}

import type { Driver } from "../types/driver";

export function normalizeDriver(raw: Driver): Driver {
  return {
    ...raw,
    driver_number: Number(raw.driver_number),
    year: Number(raw.year),
    team_colour: raw.team_colour?.startsWith("#")
      ? raw.team_colour
      : `#${raw.team_colour}`,
  };
}

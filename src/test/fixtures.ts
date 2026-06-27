import type { ConstructorStanding } from "../types/constructorStanding";
import type { Driver } from "../types/driver";

export function mockDriver(overrides: Partial<Driver> = {}): Driver {
  return {
    driver_number: 1,
    broadcast_name: "T DRIVER",
    full_name: "Test Driver",
    name_acronym: "TDR",
    team_name: "Test Team",
    team_colour: "#ff0000",
    first_name: "Test",
    last_name: "Driver",
    headshot_url: "https://example.com/headshot.png",
    country_code: "GBR",
    year: 2026,
    total_points: 0,
    ingested_at: "2026-06-01T00:00:00Z",
    ...overrides,
  };
}

export function mockStanding(
  overrides: Partial<ConstructorStanding> = {},
): ConstructorStanding {
  return {
    team_name: "Test Team",
    total_points: 0,
    year: 2026,
    ...overrides,
  };
}

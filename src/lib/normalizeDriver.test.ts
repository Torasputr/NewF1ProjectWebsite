import { describe, expect, it } from "vitest";
import { normalizeDriver } from "./normalizeDriver";
import type { Driver } from "../types/driver";

describe("normalizeDriver", () => {
  it("coerces numeric fields and adds hash to team colour", () => {
    const raw = {
      driver_number: "1",
      broadcast_name: "M VERSTAPPEN",
      full_name: "Max Verstappen",
      name_acronym: "VER",
      team_name: " Red Bull ",
      team_colour: "3671C6",
      first_name: "Max",
      last_name: "Verstappen",
      headshot_url: "",
      country_code: "NED",
      year: "2026",
      total_points: "150",
      ingested_at: "2026-06-01T00:00:00Z",
    } as unknown as Driver;

    const normalized = normalizeDriver(raw);
    expect(normalized.driver_number).toBe(1);
    expect(normalized.year).toBe(2026);
    expect(normalized.total_points).toBe(150);
    expect(normalized.team_name).toBe("Red Bull");
    expect(normalized.team_colour).toBe("#3671C6");
  });

  it("defaults missing points to zero", () => {
    const raw = {
      driver_number: 1,
      broadcast_name: "",
      full_name: "",
      name_acronym: "",
      team_name: "",
      team_colour: "",
      first_name: "",
      last_name: "",
      headshot_url: "",
      country_code: "",
      year: 2026,
      ingested_at: "",
    } as Driver;

    expect(normalizeDriver(raw).total_points).toBe(0);
  });
});

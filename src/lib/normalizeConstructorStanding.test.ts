import { describe, expect, it } from "vitest";
import { normalizeConstructorStanding } from "./normalizeConstructorStanding";
import type { ConstructorStanding } from "../types/constructorStanding";

describe("normalizeConstructorStanding", () => {
  it("trims team name and coerces numbers", () => {
    const raw = {
      team_name: " Ferrari ",
      total_points: "250",
      year: "2026",
    } as unknown as ConstructorStanding;

    expect(normalizeConstructorStanding(raw)).toEqual({
      team_name: "Ferrari",
      total_points: 250,
      year: 2026,
    });
  });
});

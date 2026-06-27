import { describe, expect, it } from "vitest";
import {
  filterByYear,
  isSeasonYear,
  parseStoredSeason,
} from "./seasonConfig";

describe("filterByYear", () => {
  it("keeps rows matching the selected season", () => {
    const rows = [
      { year: 2025, value: "a" },
      { year: 2026, value: "b" },
      { year: "2026", value: "c" },
    ];

    expect(filterByYear(rows, 2026)).toEqual([
      { year: 2026, value: "b" },
      { year: "2026", value: "c" },
    ]);
  });
});

describe("isSeasonYear", () => {
  it("accepts configured seasons only", () => {
    expect(isSeasonYear(2026)).toBe(true);
    expect(isSeasonYear(2025)).toBe(true);
    expect(isSeasonYear(2024)).toBe(false);
    expect(isSeasonYear("2026")).toBe(false);
  });
});

describe("parseStoredSeason", () => {
  it("returns default for invalid stored values", () => {
    expect(parseStoredSeason(null)).toBe(2026);
    expect(parseStoredSeason("2024")).toBe(2026);
    expect(parseStoredSeason("2025")).toBe(2025);
  });
});

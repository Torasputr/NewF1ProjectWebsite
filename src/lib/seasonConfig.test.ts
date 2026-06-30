import { describe, expect, it } from "vitest";
import {
  extractSeasonYears,
  filterByYear,
  parseStoredSeason,
} from "./seasonConfig";

describe("extractSeasonYears", () => {
  it("returns unique years newest first", () => {
    const rows = [
      { year: 2024 },
      { year: 2026 },
      { year: 2025 },
      { year: 2026 },
      { year: "2024" as unknown as number },
    ];

    expect(extractSeasonYears(rows)).toEqual([2026, 2025, 2024]);
  });

  it("ignores invalid years", () => {
    expect(extractSeasonYears([{ year: NaN }, { year: 1800 }, { year: 2024 }])).toEqual([
      2024,
    ]);
  });
});

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

describe("parseStoredSeason", () => {
  const available = [2026, 2025, 2024];

  it("returns newest available when stored value is missing or invalid", () => {
    expect(parseStoredSeason(null, available)).toBe(2026);
    expect(parseStoredSeason("2023", available)).toBe(2026);
    expect(parseStoredSeason("nope", available)).toBe(2026);
  });

  it("restores a valid stored season", () => {
    expect(parseStoredSeason("2024", available)).toBe(2024);
    expect(parseStoredSeason("2025", available)).toBe(2025);
  });

  it("falls back to current calendar year when no seasons exist", () => {
    const currentYear = new Date().getFullYear();
    expect(parseStoredSeason(null, [])).toBe(currentYear);
  });
});

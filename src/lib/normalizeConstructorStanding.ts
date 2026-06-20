import type { ConstructorStanding } from "../types/constructorStanding";

export function normalizeConstructorStanding(
  raw: ConstructorStanding,
): ConstructorStanding {
  return {
    team_name: String(raw.team_name ?? "").trim(),
    total_points: Number(raw.total_points ?? 0),
    year: Number(raw.year),
  };
}

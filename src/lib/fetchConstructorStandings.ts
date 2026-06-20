import type { ConstructorStanding } from "../types/constructorStanding";
import { normalizeConstructorStanding } from "./normalizeConstructorStanding";
import { fetchSeasonMart } from "./fetchJson";
import type { SeasonYear } from "./seasonConfig";

const CONSTRUCTOR_STANDINGS_URL = import.meta.env
  .VITE_CONSTRUCTOR_STANDINGS_URL;

export async function fetchConstructorStandings(
  year: SeasonYear,
): Promise<ConstructorStanding[]> {
  if (!CONSTRUCTOR_STANDINGS_URL) return [];

  return fetchSeasonMart(
    CONSTRUCTOR_STANDINGS_URL,
    "constructor standings",
    year,
    normalizeConstructorStanding,
  );
}

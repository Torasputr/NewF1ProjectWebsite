import type { ConstructorStanding } from "../types/constructorStanding";
import { parseNdjson } from "./parseSchedule";
import { normalizeConstructorStanding } from "./normalizeConstructorStanding";

const CONSTRUCTOR_STANDINGS_URL = import.meta.env
  .VITE_CONSTRUCTOR_STANDINGS_URL;

export async function fetchConstructorStandings(): Promise<
  ConstructorStanding[]
> {
  if (!CONSTRUCTOR_STANDINGS_URL) return [];

  const res = await fetch(CONSTRUCTOR_STANDINGS_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to load constructor standings: ${res.status} ${res.statusText}`,
    );
  }

  const text = await res.text();
  return parseNdjson<ConstructorStanding>(text).map(normalizeConstructorStanding);
}

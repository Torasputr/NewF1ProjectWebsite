import type { SessionResultRow } from "../types/sessionResults";
import { normalizeSessionResult } from "./normalizeSessionResult";
import { fetchSeasonMart } from "./fetchJson";
import type { SeasonYear } from "./seasonConfig";

const QUALI_RESULTS_URL = import.meta.env.VITE_QUALI_RESULTS_URL;

export async function fetchQualiResults(
  year: SeasonYear,
): Promise<SessionResultRow[]> {
  if (!QUALI_RESULTS_URL) return [];

  return fetchSeasonMart(
    QUALI_RESULTS_URL,
    "qualifying results",
    year,
    normalizeSessionResult,
  );
}

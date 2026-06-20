import type { SessionResultRow } from "../types/sessionResults";
import { normalizeSessionResult } from "./normalizeSessionResult";
import { fetchSeasonMart } from "./fetchJson";
import type { SeasonYear } from "./seasonConfig";

const FP_RESULTS_URL = import.meta.env.VITE_FP_RESULTS_URL;

export async function fetchFpResults(
  year: SeasonYear,
): Promise<SessionResultRow[]> {
  if (!FP_RESULTS_URL) return [];

  return fetchSeasonMart(
    FP_RESULTS_URL,
    "practice results",
    year,
    normalizeSessionResult,
  );
}

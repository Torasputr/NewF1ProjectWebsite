import type { SessionResultRow } from "../types/sessionResults";
import { normalizeSessionResult } from "./normalizeSessionResult";
import { fetchSeasonMart } from "./fetchJson";
import type { SeasonYear } from "./seasonConfig";

const SESSION_RESULTS_URL = import.meta.env.VITE_SESSION_RESULTS_URL;

if (!SESSION_RESULTS_URL) {
  throw new Error("VITE_SESSION_RESULTS_URL is not set");
}

export async function fetchSessionResults(
  year: SeasonYear,
): Promise<SessionResultRow[]> {
  return fetchSeasonMart(
    SESSION_RESULTS_URL,
    "session results",
    year,
    normalizeSessionResult,
  );
}

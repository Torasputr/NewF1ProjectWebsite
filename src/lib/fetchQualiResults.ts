import type { SessionResultRow } from "../types/sessionResults";
import { parseNdjson } from "./parseSchedule";
import { normalizeSessionResult } from "./normalizeSessionResult";

const QUALI_RESULTS_URL = import.meta.env.VITE_QUALI_RESULTS_URL;

export async function fetchQualiResults(): Promise<SessionResultRow[]> {
  if (!QUALI_RESULTS_URL) return [];

  const res = await fetch(QUALI_RESULTS_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to load qualifying results: ${res.status} ${res.statusText}`,
    );
  }

  const text = await res.text();
  return parseNdjson<SessionResultRow>(text).map(normalizeSessionResult);
}

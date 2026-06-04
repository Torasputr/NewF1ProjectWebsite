import type { SessionResultRow } from "../types/sessionResults";
import { parseNdjson } from "./parseSchedule";
import { normalizeSessionResult } from "./normalizeSessionResult";

const FP_RESULTS_URL = import.meta.env.VITE_FP_RESULTS_URL;

export async function fetchFpResults(): Promise<SessionResultRow[]> {
  if (!FP_RESULTS_URL) return [];

  const res = await fetch(FP_RESULTS_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to load practice results: ${res.status} ${res.statusText}`,
    );
  }

  const text = await res.text();
  return parseNdjson<SessionResultRow>(text).map(normalizeSessionResult);
}

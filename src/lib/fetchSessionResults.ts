import type { SessionResultRow } from "../types/sessionResults";
import { parseNdjson } from "./parseSchedule";
import { normalizeSessionResult } from "./normalizeSessionResult";

const SESSION_RESULTS_URL = import.meta.env.VITE_SESSION_RESULTS_URL;

if (!SESSION_RESULTS_URL) {
  throw new Error("VITE_SESSION_RESULTS_URL is not set");
}

export async function fetchSessionResults(): Promise<SessionResultRow[]> {
  const res = await fetch(SESSION_RESULTS_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(
      `Failed to load session results: ${res.status} ${res.statusText}`,
    );
  }

  const text = await res.text();
  return parseNdjson<SessionResultRow>(text).map(normalizeSessionResult);
}

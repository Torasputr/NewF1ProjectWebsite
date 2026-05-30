import type { Driver } from "../types/driver";
import { parseNdjson } from "./parseSchedule";
import { normalizeDriver } from "./normalizeDriver";

const DRIVERS_URL = import.meta.env.VITE_DRIVERS_URL;

if (!DRIVERS_URL) {
  throw new Error("VITE_DRIVERS_URL is not set");
}

export async function fetchDrivers(): Promise<Driver[]> {
  const res = await fetch(DRIVERS_URL, {
    method: "GET",
    headers: { Accept: "application/json" },
  });

  if (!res.ok) {
    throw new Error(`Failed to load drivers: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  return parseNdjson<Driver>(text).map(normalizeDriver);
}

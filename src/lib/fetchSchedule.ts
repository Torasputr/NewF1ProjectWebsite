import type { ScheduleSession } from '../types/schedule';
import { parseNdjson } from './parseSchedule';

const SCHEDULE_URL = import.meta.env.VITE_SCHEDULE_URL;

if (!SCHEDULE_URL) {
  throw new Error('VITE_SCHEDULE_URL is not set');
}

export async function fetchSchedule(): Promise<ScheduleSession[]> {
  const res = await fetch(SCHEDULE_URL, {
    method: 'GET',
    headers: { Accept: 'application/json' },
    // Optional: avoid stale cache after pipeline re-runs
    // cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to load schedule: ${res.status} ${res.statusText}`);
  }

  const text = await res.text();
  return parseNdjson(text);
}
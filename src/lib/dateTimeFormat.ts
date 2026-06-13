import { format } from "date-fns";
import { parseSessionDate } from "./scheduleUtils";

/** Local offset from UTC in a consistent form (e.g. UTC+7, UTC-5, UTC+5:30). */
export function getLocalTimeZoneLabel(): string {
  const offsetMinutes = -new Date().getTimezoneOffset();
  const sign = offsetMinutes >= 0 ? "+" : "-";
  const abs = Math.abs(offsetMinutes);
  const hours = Math.floor(abs / 60);
  const minutes = abs % 60;
  if (minutes === 0) {
    return `UTC${sign}${hours}`;
  }
  const mm = String(minutes).padStart(2, "0");
  return `UTC${sign}${hours}:${mm}`;
}

function toDate(value: string | Date): Date {
  return typeof value === "string" ? parseSessionDate(value) : value;
}

/** Format a UTC instant in the viewer's local timezone. */
export function formatLocal(
  value: string | Date,
  pattern: string,
  options?: { showTimeZone?: boolean },
): string {
  const date = toDate(value);
  const text = format(date, pattern);
  if (options?.showTimeZone === false) return text;
  const tz = getLocalTimeZoneLabel();
  return tz ? `${text} ${tz}` : text;
}

export function formatSessionDateTime(value: string | Date): string {
  return formatLocal(value, "EEE d MMM · HH:mm");
}

export function formatSessionDateTimeLong(value: string | Date): string {
  return formatLocal(value, "EEEE d MMMM · HH:mm");
}

export function formatSessionDate(value: string | Date): string {
  return formatLocal(value, "d MMM yyyy", { showTimeZone: false });
}

export function formatWeekendRange(start: Date, end: Date): string {
  const tz = getLocalTimeZoneLabel();
  const range = `${format(start, "d MMM")} – ${format(end, "d MMM yyyy")}`;
  return tz ? `${range} (${tz})` : range;
}

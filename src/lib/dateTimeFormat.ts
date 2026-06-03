import { format } from "date-fns";
import { parseSessionDate } from "./scheduleUtils";

/** Short timezone label for the user's device (e.g. PST, GMT+8). */
export function getLocalTimeZoneLabel(): string {
  try {
    return (
      new Intl.DateTimeFormat(undefined, { timeZoneName: "short" })
        .formatToParts(new Date())
        .find((p) => p.type === "timeZoneName")?.value ?? ""
    );
  } catch {
    return "";
  }
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

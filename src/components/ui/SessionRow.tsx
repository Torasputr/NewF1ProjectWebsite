import { format } from "date-fns";
import type { ScheduleSession } from "../../types/schedule";
import { parseSessionDate, sessionShortLabel } from "../../lib/scheduleUtils";

type SessionRowProps = { session: ScheduleSession };

export function SessionRow({ session }: SessionRowProps) {
  const start = parseSessionDate(session.date_start);
  const label = sessionShortLabel(session.session_type, session.session_name);

  return (
    <div
      className={`flex items-center justify-between gap-2 py-2 text-sm border-b border-zinc-800 last:border-0 ${
        session.is_cancelled ? "opacity-50 line-through" : ""
      }`}
    >
      <span className="font-mono text-zinc-400 w-8">{label}</span>
      <span className="flex-1 text-zinc-200">{session.session_name}</span>
      <span className="text-zinc-500 text-xs whitespace-nowrap">
        {format(start, "EEE d MMM · HH:mm")}
      </span>
    </div>
  );
}

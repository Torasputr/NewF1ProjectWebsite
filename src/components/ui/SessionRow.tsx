import { Link } from "react-router-dom";
import type { ScheduleSession } from "../../types/schedule";
import { sessionShortLabel, sessionHasResults } from "../../lib/scheduleUtils";
import { formatSessionDateTime } from "../../lib/dateTimeFormat";

type SessionRowProps = { session: ScheduleSession };

export function SessionRow({ session }: SessionRowProps) {
  const label = sessionShortLabel(session.session_type, session.session_name);
  const clickable = sessionHasResults(session);

  const rowClass = `flex items-center justify-between gap-2 py-2 text-sm border-b border-zinc-800 last:border-0 ${
    session.is_cancelled ? "opacity-50 line-through" : ""
  }`;

  const inner = (
    <>
      <span className="font-mono text-zinc-400 w-8">{label}</span>
      <span className="flex-1 text-zinc-200">{session.session_name}</span>
      <span className="text-zinc-500 text-xs whitespace-nowrap text-right">
        {formatSessionDateTime(session.date_start)}
      </span>
      {clickable && (
        <span className="text-[10px] text-zinc-600 hidden sm:inline">
          Results →
        </span>
      )}
    </>
  );

  if (clickable) {
    return (
      <Link
        to={`/race/${session.meeting_key}?session=${session.session_key}`}
        className={`${rowClass} -mx-2 px-2 rounded-md hover:bg-zinc-800/60 cursor-pointer transition-colors group`}
      >
        {inner}
      </Link>
    );
  }

  return <div className={rowClass}>{inner}</div>;
}

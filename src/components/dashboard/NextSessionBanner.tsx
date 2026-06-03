import { useEffect, useState } from "react";
import type { ScheduleSession } from "../../types/schedule";
import { parseSessionDate } from "../../lib/scheduleUtils";
import { formatSessionDateTimeLong } from "../../lib/dateTimeFormat";
import { formatCountdown } from "../../lib/countdown";

type NextSessionBannerProps = {
  session: ScheduleSession | null;
  liveSession: ScheduleSession | null;
};

const LABELS_4 = ["days", "hrs", "min", "sec"] as const;
const LABELS_3 = ["hrs", "min", "sec"] as const;

export function NextSessionBanner({
  session,
  liveSession,
}: NextSessionBannerProps) {
  const [now, setNow] = useState(() => new Date());
  const active = liveSession ?? session;

  const start = active ? parseSessionDate(active.date_start) : null;
  const isLive = Boolean(liveSession);
  const showCountdown = !isLive && session && start;

  useEffect(() => {
    if (!showCountdown) return;
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, [showCountdown]);

  if (!active || !start) {
    return (
      <div className="rounded-xl border border-zinc-800 bg-[#1c1c27] p-6">
        <p className="text-zinc-400">No upcoming sessions</p>
      </div>
    );
  }

  const countdown = showCountdown ? formatCountdown(start, now) : null;
  const parts = countdown?.split(":") ?? [];
  const labels = parts.length === 4 ? LABELS_4 : LABELS_3;

  return (
    <div className="rounded-xl border border-zinc-800 bg-gradient-to-br from-[#1c1c27] to-[#15151e] p-6">
      {isLive && (
        <span className="inline-block px-2 py-0.5 mb-2 text-xs font-bold bg-[#e10600] text-white rounded">
          LIVE
        </span>
      )}
      <p className="text-sm text-zinc-400 uppercase tracking-wide">
        Next on track
      </p>
      <h2 className="text-2xl font-semibold mt-1">{active.meeting_name}</h2>
      <p className="text-zinc-300 mt-1">
        {active.session_name} · {active.circuit_short_name}
      </p>
      <p className="text-zinc-500 text-sm mt-2">
        {formatSessionDateTimeLong(start)}
      </p>

      {countdown && parts.length > 0 && (
        <div className="mt-4">
          <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">
            Starts in
          </p>

          <div
            className="flex flex-wrap items-center gap-1 sm:gap-2"
            role="timer"
            aria-label={`Starts in ${parts.join(", ")}`}
          >
            {parts.map((part, i) => (
              <span key={i} className="flex items-center gap-1 sm:gap-2">
                {i > 0 && (
                  <span
                    className="text-zinc-500 font-mono text-2xl sm:text-3xl font-bold leading-none select-none pb-1"
                    aria-hidden
                  >
                    :
                  </span>
                )}
                <span className="flex flex-col items-center gap-1">
                  <span className="inline-flex min-w-[2.75rem] justify-center bg-zinc-900 border border-zinc-800 px-3 py-2 rounded-lg font-mono text-2xl sm:text-3xl font-bold tabular-nums text-[#e10600]">
                    {part}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                    {labels[i]}
                  </span>
                </span>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

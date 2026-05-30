import { format } from "date-fns";
import type { RaceWeekend } from "../../types/schedule";
import type { ScheduleSession } from "../../types/schedule";
import { parseSessionDate, isMeetingCancelled } from "../../lib/scheduleUtils";
import { CountdownDisplay } from "../ui/CountdownDisplay";

type HeroSectionProps = {
  weekend: RaceWeekend | null;
  nextSession: ScheduleSession | null;
  liveSession: ScheduleSession | null;
};

export function HeroSection({
  weekend,
  nextSession,
  liveSession,
}: HeroSectionProps) {
  const isLive = Boolean(liveSession);
  const activeSession = liveSession ?? nextSession;

  if (!weekend || !activeSession) {
    return (
      <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#1c1c27] p-8">
        <p className="text-zinc-400">No upcoming race weekends</p>
      </section>
    );
  }

  const sessionStart = parseSessionDate(activeSession.date_start);
  const cancelled = isMeetingCancelled(weekend);

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-[#1c1c27] via-[#15151e] to-[#0f0f14]">
      {weekend.circuit_image && (
        <img
          src={weekend.circuit_image}
          alt=""
          className="absolute right-0 top-0 h-full w-1/2 max-w-md object-contain opacity-[0.08] pointer-events-none select-none"
        />
      )}

      <div className="relative p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        <div>
          {isLive && (
            <span className="inline-block px-2 py-0.5 mb-3 text-xs font-bold bg-[#e10600] text-white rounded">
              LIVE
            </span>
          )}
          {cancelled && !isLive && (
            <span className="inline-block px-2 py-0.5 mb-3 text-xs font-bold bg-zinc-700 text-zinc-200 rounded">
              MEETING CANCELLED
            </span>
          )}

          <div className="flex items-center gap-2 mb-2">
            <img
              src={weekend.country_flag}
              alt=""
              className="w-8 h-5 object-cover rounded-sm"
            />
            <p className="text-sm text-zinc-400 uppercase tracking-wide">
              Next meeting
            </p>
          </div>

          <h2 className="text-3xl sm:text-4xl font-bold text-zinc-100">
            {weekend.meeting_name}
          </h2>
          <p className="text-zinc-400 mt-2">
            {weekend.circuit_short_name} · {weekend.location}
          </p>
          <p className="text-sm text-zinc-500 mt-1">
            {format(weekend.weekendStart, "d MMM")} –{" "}
            {format(weekend.weekendEnd, "d MMM yyyy")}
          </p>

          <div className="mt-4 pt-4 border-t border-zinc-800">
            <p className="text-zinc-300">
              {isLive ? "Now" : "Up next"}:{" "}
              <span className="font-medium text-white">
                {activeSession.session_name}
              </span>
            </p>
            <p className="text-sm text-zinc-500 mt-1">
              {format(sessionStart, "EEEE d MMMM · HH:mm")} UTC
            </p>
          </div>
        </div>

        <div className="flex justify-start lg:justify-end">
          {!isLive && !cancelled && <CountdownDisplay target={sessionStart} />}
          {isLive && (
            <p className="text-[#e10600] font-mono text-4xl font-bold">
              ON TRACK
            </p>
          )}
        </div>
      </div>
    </section>
  );
}

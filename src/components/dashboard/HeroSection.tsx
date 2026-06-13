import type { RaceWeekend } from "../../types/schedule";
import type { ScheduleSession } from "../../types/schedule";
import type { HeroSessionPodiums } from "../../lib/sessionResultUtils";
import { parseSessionDate, isMeetingCancelled } from "../../lib/scheduleUtils";
import {
  formatSessionDateTimeLong,
  formatWeekendRange,
} from "../../lib/dateTimeFormat";
import { CountdownDisplay } from "../ui/CountdownDisplay";
import { HeroLastSession } from "./HeroLastSession";

type HeroSectionProps = {
  weekend: RaceWeekend | null;
  nextSession: ScheduleSession | null;
  liveSession: ScheduleSession | null;
  lastSessionPodiums?: HeroSessionPodiums | null;
};

export function HeroSection({
  weekend,
  nextSession,
  liveSession,
  lastSessionPodiums,
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
  const showLastSession = lastSessionPodiums && !cancelled;

  return (
    <section className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-[#1c1c27] via-[#15151e] to-[#0f0f14]">
      {weekend.circuit_image && (
        <>
          <div className="absolute inset-0 bg-gradient-to-r from-[#1c1c27] via-[#1c1c27]/90 to-[#1c1c27]/40 pointer-events-none" />
          <img
            src={weekend.circuit_image}
            alt=""
            className="absolute -right-4 top-1/2 -translate-y-1/2 h-[85%] w-auto max-w-[min(42%,320px)] object-contain opacity-[0.05] pointer-events-none select-none"
          />
        </>
      )}

      <div className="relative">
        <div className="p-6 sm:p-8 lg:p-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-8">
          <div className="min-w-0 flex-1">
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
              {formatWeekendRange(weekend.weekendStart, weekend.weekendEnd)}
            </p>

            <div className="mt-4 pt-4 border-t border-zinc-800/80">
              <p className="text-zinc-300">
                {isLive ? "Now" : "Up next"}:{" "}
                <span className="font-medium text-white">
                  {activeSession.session_name}
                </span>
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                {formatSessionDateTimeLong(sessionStart)}
              </p>
            </div>
          </div>

          <div className="shrink-0 flex justify-start lg:justify-end">
            {!isLive && !cancelled && (
              <CountdownDisplay target={sessionStart} />
            )}
            {isLive && (
              <p className="text-[#e10600] font-mono text-4xl font-bold">
                ON TRACK
              </p>
            )}
          </div>
        </div>

        {showLastSession && (
          <div className="border-t border-zinc-800/60 px-6 sm:px-8 lg:px-10 py-5 bg-black/10 w-full">
            <HeroLastSession podiums={lastSessionPodiums} />
          </div>
        )}
      </div>
    </section>
  );
}

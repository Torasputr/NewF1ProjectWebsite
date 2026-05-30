import { format } from "date-fns";
import type { RaceWeekend } from "../../types/schedule";
import { SessionRow } from "../ui/SessionRow";

type RaceWeekendCardProps = { weekend: RaceWeekend };

export function RaceWeekendCard({ weekend }: RaceWeekendCardProps) {
  const isTesting = weekend.meeting_name.toLowerCase().includes("testing");

  return (
    <article className="rounded-xl border border-zinc-800 bg-[#1c1c27] overflow-hidden">
      <div className="p-4 border-b border-zinc-800">
        <div className="flex items-center gap-2">
          <img
            src={weekend.country_flag}
            alt=""
            className="w-6 h-4 object-cover rounded-sm"
          />
          <h3 className="font-semibold text-zinc-100">
            {weekend.meeting_name}
          </h3>
          {isTesting && (
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-700 text-zinc-300">
              Testing
            </span>
          )}
        </div>
        <p className="text-sm text-zinc-400 mt-1">
          {weekend.circuit_short_name} · {weekend.location}
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          {format(weekend.weekendStart, "d MMM")} –{" "}
          {format(weekend.weekendEnd, "d MMM yyyy")}
        </p>
      </div>
      <div className="px-4 py-2">
        {weekend.sessions.map((s) => (
          <SessionRow key={s.session_key} session={s} />
        ))}
      </div>
    </article>
  );
}

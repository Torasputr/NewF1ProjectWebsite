import { useNavigate } from "react-router-dom";
import type { RaceWeekend } from "../../types/schedule";
import {
  isMeetingCancelled,
  weekendHasClickableResults,
} from "../../lib/scheduleUtils";
import { formatWeekendRange } from "../../lib/dateTimeFormat";

type RaceStripProps = {
  previous: RaceWeekend | null;
  current: RaceWeekend | null;
  next: RaceWeekend | null;
};

function RaceStripCard({
  weekend,
  variant,
}: {
  weekend: RaceWeekend | null;
  variant: "previous" | "current" | "next";
}) {
  const navigate = useNavigate();

  if (!weekend) {
    return (
      <div className="rounded-xl border border-dashed border-zinc-800 bg-zinc-900/30 p-4 min-h-[120px] flex items-center justify-center">
        <p className="text-sm text-zinc-600">—</p>
      </div>
    );
  }

  const cancelled = isMeetingCancelled(weekend);
  const isCurrent = variant === "current";
  const cardClickable = weekendHasClickableResults(weekend);

  const goToWeekend = () => {
    if (cardClickable) {
      navigate(`/race/${weekend.meeting_key}`);
    }
  };

  return (
    <article
      role={cardClickable ? "link" : undefined}
      tabIndex={cardClickable ? 0 : undefined}
      onClick={cardClickable ? goToWeekend : undefined}
      onKeyDown={
        cardClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goToWeekend();
              }
            }
          : undefined
      }
      className={`rounded-xl border p-4 min-h-[120px] flex flex-col transition-[border-color,background-color] ${
        isCurrent
          ? "border-[#e10600]/60 bg-[#1c1c27] ring-1 ring-[#e10600]/30"
          : "border-zinc-800 bg-[#1c1c27]"
      } ${
        cardClickable
          ? "group cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/40"
          : ""
      }`}
    >
      <p className="text-[10px] uppercase tracking-wider text-zinc-500 mb-2">
        {variant === "previous" && "Previous"}
        {variant === "current" && "Current"}
        {variant === "next" && "Next race"}
      </p>

      <div className="flex items-center gap-2">
        <img
          src={weekend.country_flag}
          alt=""
          className="w-6 h-4 object-cover rounded-sm shrink-0"
        />
        <h3 className="font-semibold text-zinc-100 text-sm leading-tight">
          {weekend.meeting_name}
        </h3>
      </div>

      <p className="text-xs text-zinc-500 mt-2">
        {formatWeekendRange(weekend.weekendStart, weekend.weekendEnd)}
      </p>

      {cancelled && (
        <span className="mt-auto pt-2 text-[10px] uppercase text-red-400">
          Cancelled
        </span>
      )}
      {isCurrent && !cancelled && (
        <span className="mt-auto pt-2 text-[10px] uppercase text-[#e10600]">
          Up next
        </span>
      )}
      {cardClickable && (
        <p className="mt-auto pt-2 text-[10px] text-zinc-600 transition-colors group-hover:text-[#e10600]">
          View weekend →
        </p>
      )}
    </article>
  );
}

export function RaceStrip({ previous, current, next }: RaceStripProps) {
  return (
    <section>
      <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">
        Around the calendar
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <RaceStripCard weekend={previous} variant="previous" />
        <RaceStripCard weekend={current} variant="current" />
        <RaceStripCard weekend={next} variant="next" />
      </div>
    </section>
  );
}

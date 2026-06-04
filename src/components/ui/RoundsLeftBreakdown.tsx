import type { RemainingRoundsBreakdown } from "../../lib/scheduleUtils";

type RoundsLeftBreakdownProps = {
  breakdown: RemainingRoundsBreakdown;
  /** Inline stats row (constructors card). */
  compact?: boolean;
};

export function RoundsLeftBreakdown({
  breakdown,
  compact = false,
}: RoundsLeftBreakdownProps) {
  if (compact) {
    return (
      <span>
        {breakdown.total} (GP {breakdown.grandPrixOnly} · Sprint{" "}
        {breakdown.withSprint})
      </span>
    );
  }

  return (
    <>
      <div className="mt-0.5 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
        <p className="text-sm font-semibold text-zinc-100 tabular-nums">
          GP{" "}
          <span className="text-[#e10600]">{breakdown.grandPrixOnly}</span>
        </p>
        <p className="text-sm font-semibold text-zinc-100 tabular-nums">
          Sprint{" "}
          <span className="text-[#e10600]">{breakdown.withSprint}</span>
        </p>
      </div>
      <p className="text-[10px] text-zinc-500 mt-0.5 tabular-nums">
        {breakdown.total} total
      </p>
    </>
  );
}

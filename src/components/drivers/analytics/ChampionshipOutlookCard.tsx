import { Link } from "react-router-dom";
import type { ChampionshipOutlook } from "../../../lib/championshipOutlookUtils";
import { RoundsLeftBreakdown } from "../../ui/RoundsLeftBreakdown";

type ChampionshipOutlookCardProps = {
  outlook: ChampionshipOutlook;
};

function DriverRef({ driver }: { driver: { driver_number: number; full_name: string; name_acronym: string } }) {
  return (
    <Link
      to={`/drivers/${driver.driver_number}`}
      className="text-zinc-200 hover:text-[#e10600] transition-colors font-medium"
    >
      {driver.full_name}
    </Link>
  );
}

export function ChampionshipOutlookCard({ outlook }: ChampionshipOutlookCardProps) {
  const {
    leader,
    challenger,
    isLeader,
    gapToLeader,
    secondPlace,
    leadOverSecond,
    remainingMeetings,
    remainingRounds,
    maxRemainingPoints,
    canWin,
    pointsNeeded,
  } = outlook;

  const remainingCount = remainingRounds.total;

  return (
    <article className="rounded-xl border border-zinc-800 bg-gradient-to-br from-[#1c1c27] to-[#15151e] p-4 space-y-3">
      <header>
        <h3 className="text-sm font-semibold text-zinc-100">
          Championship outlook
        </h3>
        <p className="text-xs text-zinc-500 mt-0.5">
          Title fight math from standings and remaining weekends.
        </p>
      </header>

      {isLeader ? (
        <div className="rounded-lg border border-amber-500/30 bg-amber-500/5 px-3 py-3">
          <p className="text-sm font-medium text-amber-200">
            Championship leader
          </p>
          <p className="text-xs text-zinc-400 mt-1">
            {challenger.full_name} leads on{" "}
            <span className="text-[#e10600] font-semibold tabular-nums">
              {challenger.total_points} pts
            </span>
            {secondPlace && leadOverSecond != null ? (
              <>
                {" "}
                —{" "}
                <span className="tabular-nums text-zinc-300">
                  +{leadOverSecond}
                </span>{" "}
                ahead of <DriverRef driver={secondPlace} /> (
                {secondPlace.total_points} pts)
              </>
            ) : (
              "."
            )}
          </p>
        </div>
      ) : canWin ? (
        <div className="rounded-lg border border-[#e10600]/30 bg-[#e10600]/5 px-3 py-3">
          <p className="text-sm font-medium text-zinc-100">Still in the title fight</p>
          <p className="text-xs text-zinc-400 mt-1">
            <span className="tabular-nums text-zinc-300">{gapToLeader} pts</span>{" "}
            behind <DriverRef driver={leader} /> ({leader.total_points} pts).
            Needs{" "}
            <span className="text-[#e10600] font-semibold tabular-nums">
              {pointsNeeded} more
            </span>{" "}
            than the leader from remaining scoring sessions.
          </p>
        </div>
      ) : (
        <div className="rounded-lg border border-zinc-700 bg-zinc-900/40 px-3 py-3">
          <p className="text-sm font-medium text-zinc-400">
            Mathematically out of the title fight
          </p>
          <p className="text-xs text-zinc-500 mt-1">
            Even with max points ({maxRemainingPoints}) from{" "}
            {remainingCount} remaining weekend
            {remainingCount === 1 ? "" : "s"} ({remainingRounds.grandPrixOnly}{" "}
            GP, {remainingRounds.withSprint} sprint), cannot pass{" "}
            <DriverRef driver={leader} /> ({leader.total_points} pts).
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <div className="rounded-lg border border-zinc-800 bg-[#1c1c27] px-3 py-2">
          <p className="text-[10px] text-zinc-500">Gap to leader</p>
          <p className="text-sm font-semibold text-zinc-100 mt-0.5 tabular-nums">
            {isLeader ? "—" : `-${gapToLeader}`}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-[#1c1c27] px-3 py-2">
          <p className="text-[10px] text-zinc-500">Points needed</p>
          <p className="text-sm font-semibold text-zinc-100 mt-0.5 tabular-nums">
            {isLeader ? "—" : pointsNeeded}
          </p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-[#1c1c27] px-3 py-2">
          <p className="text-[10px] text-zinc-500">Rounds left</p>
          <RoundsLeftBreakdown breakdown={remainingRounds} />
        </div>
        <div className="rounded-lg border border-zinc-800 bg-[#1c1c27] px-3 py-2">
          <p className="text-[10px] text-zinc-500">Max pts available</p>
          <p className="text-sm font-semibold text-zinc-100 mt-0.5 tabular-nums">
            {maxRemainingPoints}
          </p>
        </div>
      </div>

      {remainingCount > 0 && (
        <p className="text-[10px] text-zinc-600">
          Remaining:{" "}
          {remainingMeetings
            .map((w) => w.circuit_short_name)
            .join(", ")}
          . Max per weekend includes sprint (8) and race (25) where scheduled.
        </p>
      )}
    </article>
  );
}

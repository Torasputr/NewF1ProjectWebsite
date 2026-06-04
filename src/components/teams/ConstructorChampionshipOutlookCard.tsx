import type { ConstructorChampionshipOutlook } from "../../lib/championshipOutlookUtils";
import { RoundsLeftBreakdown } from "../ui/RoundsLeftBreakdown";

type ConstructorChampionshipOutlookCardProps = {
  outlook: ConstructorChampionshipOutlook;
  teamColour: string;
};

function TeamName({ name }: { name: string }) {
  return <span className="text-zinc-200 font-medium">{name}</span>;
}

export function ConstructorChampionshipOutlookCard({
  outlook,
  teamColour,
}: ConstructorChampionshipOutlookCardProps) {
  const {
    leader,
    challenger,
    isLeader,
    gapToLeader,
    secondPlace,
    leadOverSecond,
    remainingRounds,
    maxRemainingPoints,
    canWin,
    pointsNeeded,
  } = outlook;

  const remainingCount = remainingRounds.total;

  return (
    <div
      className="mx-3 mb-3 rounded-lg border border-zinc-800/80 bg-zinc-900/30 px-3 py-3 space-y-2"
      style={{ borderLeftWidth: 3, borderLeftColor: teamColour }}
    >
      <p className="text-[10px] text-zinc-500 uppercase tracking-wide">
        Constructors championship
      </p>

      {isLeader ? (
        <div>
          <p className="text-xs font-medium text-amber-200/90">
            Leading the constructors&apos;
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
            <TeamName name={challenger.team_name} /> on{" "}
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
                ahead of <TeamName name={secondPlace.team_name} /> (
                {secondPlace.total_points} pts)
              </>
            ) : (
              "."
            )}
          </p>
        </div>
      ) : canWin ? (
        <div>
          <p className="text-xs font-medium text-zinc-100">
            Still in the constructors&apos; fight
          </p>
          <p className="text-[11px] text-zinc-400 mt-0.5 leading-relaxed">
            <span className="tabular-nums text-zinc-300">{gapToLeader} pts</span>{" "}
            behind <TeamName name={leader.team_name} /> ({leader.total_points}{" "}
            pts). Needs{" "}
            <span className="text-[#e10600] font-semibold tabular-nums">
              {pointsNeeded}
            </span>{" "}
            more than the leader from remaining weekends.
          </p>
        </div>
      ) : (
        <div>
          <p className="text-xs font-medium text-zinc-400">
            Out of the constructors&apos; fight
          </p>
          <p className="text-[11px] text-zinc-500 mt-0.5 leading-relaxed">
            Max {maxRemainingPoints} pts left across {remainingCount} weekend
            {remainingCount === 1 ? "" : "s"} ({remainingRounds.grandPrixOnly} GP,{" "}
            {remainingRounds.withSprint} sprint) — cannot catch{" "}
            <TeamName name={leader.team_name} /> ({leader.total_points} pts).
          </p>
        </div>
      )}

      <div className="flex flex-wrap gap-x-4 gap-y-1 text-[10px] text-zinc-500 tabular-nums">
        <span>
          Gap: {isLeader ? "—" : `-${gapToLeader}`}
        </span>
        <span>Need: {isLeader ? "—" : pointsNeeded}</span>
        <span>
          Rounds: <RoundsLeftBreakdown breakdown={remainingRounds} compact />
        </span>
        <span>Max left: {maxRemainingPoints}</span>
      </div>
    </div>
  );
}

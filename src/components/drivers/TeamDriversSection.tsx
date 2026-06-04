import { useMemo } from "react";
import type { ConstructorStanding } from "../../types/constructorStanding";
import type { Driver } from "../../types/driver";
import type { RaceWeekend } from "../../types/schedule";
import { computeConstructorChampionshipOutlook } from "../../lib/championshipOutlookUtils";
import { getChampionshipPosition } from "../../lib/driverUtils";
import { ConstructorChampionshipOutlookCard } from "../teams/ConstructorChampionshipOutlookCard";
import { TeamDriverTile } from "./TeamDriverTile";

type TeamDriversSectionProps = {
  teamName: string;
  drivers: Driver[];
  teamColour?: string;
  allDrivers: Driver[];
  standings: ConstructorStanding[];
  weekends: RaceWeekend[];
};

export function TeamDriversSection({
  teamName,
  drivers,
  teamColour,
  allDrivers,
  standings,
  weekends,
}: TeamDriversSectionProps) {
  const teamPoints = drivers.reduce((sum, d) => sum + d.total_points, 0);
  const colour = teamColour ?? "#71717a";

  const constructorOutlook = useMemo(
    () =>
      computeConstructorChampionshipOutlook(teamName, standings, weekends),
    [teamName, standings, weekends],
  );

  return (
    <article className="rounded-xl border border-zinc-800 bg-[#1c1c27] overflow-hidden">
      <div className="h-1" style={{ backgroundColor: colour }} />
      <div className="px-4 py-3 flex items-center justify-between gap-3 border-b border-zinc-800/80">
        <div className="flex items-center gap-2 min-w-0">
          <span
            className="w-1 h-8 rounded-full shrink-0"
            style={{ backgroundColor: colour }}
            aria-hidden
          />
          <h2 className="text-base font-semibold text-zinc-100 truncate">
            {teamName}
          </h2>
        </div>
        <p className="text-sm tabular-nums shrink-0">
          <span className="font-bold text-[#e10600]">{teamPoints}</span>
          <span className="text-zinc-500 ml-1">pts</span>
        </p>
      </div>
      {constructorOutlook && (
        <ConstructorChampionshipOutlookCard
          outlook={constructorOutlook}
          teamColour={colour}
        />
      )}
      <div className="p-3 grid grid-cols-1 sm:grid-cols-2 gap-2">
        {drivers.map((d) => (
          <TeamDriverTile
            key={d.driver_number}
            driver={d}
            championshipPosition={getChampionshipPosition(
              allDrivers,
              d.driver_number,
            )}
          />
        ))}
      </div>
    </article>
  );
}

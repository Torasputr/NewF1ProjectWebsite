import { useMemo } from "react";
import type { Driver } from "../../../types/driver";
import type { DriverSessionResult } from "../../../lib/driverPerformanceUtils";
import type { RaceWeekend } from "../../../types/schedule";
import { computeChampionshipOutlook } from "../../../lib/championshipOutlookUtils";
import {
  buildMeetingCircuitMap,
  computeRacePointsSummary,
  getDriverRaceSessionPointsSeries,
} from "../../../lib/driverAnalyticsUtils";
import { ChampionshipOutlookCard } from "./ChampionshipOutlookCard";
import { DriverRacePointsChart } from "./DriverRacePointsChart";

type DriverAnalyticsSectionProps = {
  driver: Driver;
  allDrivers: Driver[];
  sessions: DriverSessionResult[];
  weekends: RaceWeekend[];
  teamColour: string;
};

function InsightChip({
  label,
  value,
  sub,
}: {
  label: string;
  value: string;
  sub?: string;
}) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-[#1c1c27] px-3 py-2 min-w-0">
      <p className="text-[10px] text-zinc-500">{label}</p>
      <p className="text-sm font-semibold text-zinc-100 mt-0.5 tabular-nums truncate">
        {value}
      </p>
      {sub && (
        <p className="text-[10px] text-zinc-500 mt-0.5 truncate">{sub}</p>
      )}
    </div>
  );
}

export function DriverAnalyticsSection({
  driver,
  allDrivers,
  sessions,
  weekends,
  teamColour,
}: DriverAnalyticsSectionProps) {
  const circuitByMeeting = useMemo(
    () => buildMeetingCircuitMap(weekends),
    [weekends],
  );

  const championshipOutlook = useMemo(
    () => computeChampionshipOutlook(driver, allDrivers, weekends),
    [driver, allDrivers, weekends],
  );

  const pointsSeries = useMemo(
    () => getDriverRaceSessionPointsSeries(sessions, circuitByMeeting),
    [sessions, circuitByMeeting],
  );

  const summary = useMemo(
    () => computeRacePointsSummary(pointsSeries),
    [pointsSeries],
  );

  const raceSeries = useMemo(
    () => pointsSeries.filter((row) => !row.isSprint),
    [pointsSeries],
  );

  const sprintSeries = useMemo(
    () => pointsSeries.filter((row) => row.isSprint),
    [pointsSeries],
  );

  return (
    <section className="space-y-3">
      <div>
        <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
          Analytics
        </h2>
        <p className="text-xs text-zinc-500 mt-0.5">
          Title fight outlook and points by session.
        </p>
      </div>

      {championshipOutlook && (
        <ChampionshipOutlookCard outlook={championshipOutlook} />
      )}

      <article className="rounded-xl border border-zinc-800 bg-gradient-to-br from-[#1c1c27] to-[#15151e] p-4 space-y-3">
        <header>
          <h3 className="text-sm font-semibold text-zinc-100">
            Points by session
          </h3>
          <p className="text-xs text-zinc-500 mt-0.5">
            Grand prix and sprint charts, each in chronological order.
          </p>
        </header>

        {summary.sessionCount > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <InsightChip
              label="Sessions"
              value={String(summary.sessionCount)}
            />
            <div className="rounded-lg border border-zinc-800 bg-[#1c1c27] px-3 py-2 min-w-0">
              <p className="text-[10px] text-zinc-500">Avg pts</p>
              <div className="mt-1 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
                <p className="text-sm font-semibold text-zinc-100 tabular-nums">
                  Race{" "}
                  <span className="text-[#e10600]">
                    {summary.averageRacePoints ?? "—"}
                  </span>
                </p>
                <p className="text-sm font-semibold text-zinc-100 tabular-nums">
                  Sprint{" "}
                  <span className="text-[#e10600]">
                    {summary.averageSprintPoints ?? "—"}
                  </span>
                </p>
              </div>
            </div>
            <InsightChip
              label="Best"
              value={
                summary.best ? `${summary.best.points} pts` : "—"
              }
              sub={
                summary.best
                  ? `${summary.best.circuit_short_name}${summary.best.isSprint ? " (Sprint)" : ""}`
                  : undefined
              }
            />
            <InsightChip
              label="Lowest"
              value={
                summary.worst ? `${summary.worst.points} pts` : "—"
              }
              sub={
                summary.worst
                  ? `${summary.worst.circuit_short_name}${summary.worst.isSprint ? " (Sprint)" : ""}`
                  : undefined
              }
            />
          </div>
        )}

        <div className="space-y-4">
          {raceSeries.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">
                Grand prix
              </h4>
              <DriverRacePointsChart
                series={raceSeries}
                teamColour={teamColour}
                maxScale={25}
              />
            </div>
          )}

          {sprintSeries.length > 0 && (
            <div>
              <h4 className="text-xs font-medium text-zinc-400 uppercase tracking-wide mb-2">
                Sprint
              </h4>
              <DriverRacePointsChart
                series={sprintSeries}
                teamColour={teamColour}
                maxScale={8}
              />
            </div>
          )}

          {raceSeries.length === 0 && sprintSeries.length === 0 && (
            <DriverRacePointsChart series={[]} teamColour={teamColour} />
          )}
        </div>
      </article>
    </section>
  );
}

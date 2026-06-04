import { useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useSchedule } from "../hooks/useSchedule";
import { useDrivers } from "../hooks/useDrivers";
import { useSessionResults } from "../hooks/useSessionResults";
import { Layout } from "../components/layout/Layout";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { DriverAnalyticsSection } from "../components/drivers/analytics/DriverAnalyticsSection";
import { DriverPerformanceTable } from "../components/drivers/DriverPerformanceTable";
import { PipelineFooter } from "../components/layout/PipelineFooter";
import { groupByMeeting } from "../lib/scheduleUtils";
import {
  buildMeetingNameMap,
  computeDriverPerformanceStats,
  getDriverSessionResults,
} from "../lib/driverPerformanceUtils";
import {
  findDriverByNumber,
  getChampionshipPosition,
  uniqueDrivers,
} from "../lib/driverUtils";

function StatChip({
  label,
  value,
  highlight,
  sub,
}: {
  label: string;
  value: string;
  highlight?: boolean;
  sub?: string;
}) {
  return (
    <div
      className={`rounded-xl border px-4 py-3 ${
        highlight
          ? "border-[#e10600]/40 bg-[#e10600]/5"
          : "border-zinc-800 bg-[#1c1c27]"
      }`}
    >
      <p className="text-xs text-zinc-500">{label}</p>
      <p
        className={`text-xl font-semibold mt-1 tabular-nums ${
          highlight ? "text-[#e10600]" : "text-zinc-100"
        }`}
      >
        {value}
      </p>
      {sub && <p className="text-[10px] text-zinc-500 mt-0.5">{sub}</p>}
    </div>
  );
}

export function DriverDetailPage() {
  const { driverNumber: driverNumberParam } = useParams<{
    driverNumber: string;
  }>();
  const driverNumber = Number(driverNumberParam);

  const {
    data: schedule,
    loading: scheduleLoading,
    error: scheduleError,
  } = useSchedule();
  const {
    data: driversData,
    loading: driversLoading,
    error: driversError,
  } = useDrivers();
  const {
    data: results,
    loading: resultsLoading,
    error: resultsError,
  } = useSessionResults();

  const weekends = useMemo(
    () => (schedule ? groupByMeeting(schedule) : []),
    [schedule],
  );

  const meetingNames = useMemo(() => buildMeetingNameMap(weekends), [weekends]);

  const driver = useMemo(() => {
    if (!driversData || Number.isNaN(driverNumber)) return null;
    return findDriverByNumber(driversData, driverNumber);
  }, [driversData, driverNumber]);

  const sessionHistory = useMemo(() => {
    if (!results || Number.isNaN(driverNumber)) return [];
    return getDriverSessionResults(results, driverNumber, meetingNames);
  }, [results, driverNumber, meetingNames]);

  const stats = useMemo(() => {
    if (!driver || !driversData) return null;
    const position = getChampionshipPosition(driversData, driver.driver_number);
    return computeDriverPerformanceStats(sessionHistory, driver, position);
  }, [driver, driversData, sessionHistory]);

  const loading = scheduleLoading || driversLoading || resultsLoading;

  if (loading) {
    return (
      <Layout year={2026}>
        <LoadingSkeleton />
      </Layout>
    );
  }

  if (driversError) {
    return (
      <Layout year={2026}>
        <ErrorMessage title="Could not load drivers" message={driversError} />
      </Layout>
    );
  }

  if (scheduleError) {
    return (
      <Layout year={2026}>
        <ErrorMessage title="Could not load schedule" message={scheduleError} />
      </Layout>
    );
  }

  if (!driver || Number.isNaN(driverNumber)) {
    return (
      <Layout year={2026}>
        <ErrorMessage
          title="Driver not found"
          message={`No driver found for #${driverNumberParam}.`}
        />
        <Link
          to="/drivers"
          className="text-[#e10600] text-sm mt-4 inline-block"
        >
          ← Back to drivers
        </Link>
      </Layout>
    );
  }

  const allDrivers = driversData ? uniqueDrivers(driversData) : [];
  const leaderPoints = allDrivers[0]?.total_points ?? 0;
  const gapToLeader =
    stats && stats.championshipPosition !== 1
      ? leaderPoints - driver.total_points
      : null;

  return (
    <Layout year={2026} lastUpdated={driver.ingested_at}>
      <div className="space-y-8">
        <Link
          to="/drivers"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          ← Back to drivers
        </Link>

        <header className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-[#1c1c27] to-[#15151e] p-6 sm:p-8">
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: driver.team_colour }}
          />
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <img
              src={driver.headshot_url}
              alt=""
              className="w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover bg-zinc-800 ring-2 ring-zinc-700"
              onError={(e) => {
                (e.target as HTMLImageElement).style.visibility = "hidden";
              }}
            />
            <div className="flex-1 min-w-0">
              <p className="text-xs font-mono text-zinc-500">
                #{driver.driver_number} · {driver.country_code}
              </p>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 mt-1">
                {driver.full_name}
              </h1>
              <p className="text-zinc-400 mt-1">
                {driver.team_name} · {driver.name_acronym}
              </p>
              <div className="flex flex-wrap items-baseline gap-3 mt-3">
                <p className="text-3xl font-bold text-[#e10600] tabular-nums">
                  {driver.total_points}
                  <span className="text-sm font-normal text-zinc-500 ml-1">
                    pts
                  </span>
                </p>
                {stats?.championshipPosition != null && (
                  <p className="text-sm text-zinc-400">
                    P{stats.championshipPosition} in championship
                    {gapToLeader != null && gapToLeader > 0 && (
                      <span className="text-zinc-500">
                        {" "}
                        (−{gapToLeader} to leader)
                      </span>
                    )}
                  </p>
                )}
              </div>
            </div>
          </div>
        </header>

        {stats && (
          <section className="space-y-4">
            <div>
              <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">
                Season stats
              </h2>
              <p className="text-xs text-zinc-500 -mt-2 mb-3">
                From grand prix races unless noted.
              </p>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                <StatChip
                  label="Race starts"
                  value={String(stats.raceStarts + stats.sprintStarts)}
                  sub={`${stats.raceStarts} race + ${stats.sprintStarts} sprint`}
                />
                <StatChip
                  label="DNFs"
                  value={String(stats.dnfs)}
                  sub="Race & sprint"
                />
                <StatChip
                  label="Best finish"
                  value={
                    stats.bestFinish != null ? `P${stats.bestFinish}` : "—"
                  }
                />
                <StatChip label="Wins" value={String(stats.wins)} />
                <StatChip label="Podiums" value={String(stats.podiums)} />
                <StatChip label="Poles" value={String(stats.poles)} />
              </div>
            </div>
          </section>
        )}

        {driversData && (
          <DriverAnalyticsSection
            driver={driver}
            allDrivers={allDrivers}
            sessions={sessionHistory}
            weekends={weekends}
            teamColour={driver.team_colour}
          />
        )}

        <section>
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">
            Session history
          </h2>
          {resultsError && (
            <ErrorMessage
              title="Could not load results"
              message={resultsError}
            />
          )}
          {!resultsError && (
            <DriverPerformanceTable sessions={sessionHistory} />
          )}
        </section>

        <PipelineFooter />
      </div>
    </Layout>
  );
}

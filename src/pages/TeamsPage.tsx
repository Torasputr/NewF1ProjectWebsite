import { useMemo, useState } from "react";
import { useSeason } from "../context/SeasonContext";
import { useDrivers } from "../hooks/useDrivers";
import { useConstructorStandings } from "../hooks/useConstructorStandings";
import { useSchedule } from "../hooks/useSchedule";
import { Layout } from "../components/layout/Layout";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { PipelineFooter } from "../components/layout/PipelineFooter";
import { TeamDriversSection } from "../components/drivers/TeamDriversSection";
import { ConstructorStandingsTable } from "../components/teams/ConstructorStandingsTable";
import {
  uniqueDrivers,
  groupByTeam,
  filterDrivers,
} from "../lib/driverUtils";
import {
  constructorStandingsFromDrivers,
  sortConstructorStandings,
  teamColourByName,
} from "../lib/constructorUtils";
import { groupByMeeting } from "../lib/scheduleUtils";

export function TeamsPage() {
  const { year } = useSeason();
  const { data: driversData, loading: driversLoading, error: driversError } =
    useDrivers();
  const {
    data: martStandings,
    loading: standingsLoading,
    error: standingsError,
  } = useConstructorStandings();
  const {
    data: schedule,
    loading: scheduleLoading,
    error: scheduleError,
  } = useSchedule();
  const [search, setSearch] = useState("");

  const weekends = useMemo(
    () => (schedule ? groupByMeeting(schedule) : []),
    [schedule],
  );

  const drivers = useMemo(
    () => (driversData ? uniqueDrivers(driversData) : []),
    [driversData],
  );

  const standings = useMemo(() => {
    if (drivers.length > 0) {
      return sortConstructorStandings(constructorStandingsFromDrivers(drivers));
    }
    if (martStandings && martStandings.length > 0) {
      return sortConstructorStandings(martStandings);
    }
    return [];
  }, [martStandings, drivers]);

  const teamColours = useMemo(() => teamColourByName(drivers), [drivers]);

  const filtered = useMemo(
    () => filterDrivers(drivers, search),
    [drivers, search],
  );
  const teams = useMemo(() => groupByTeam(filtered), [filtered]);

  const loading = driversLoading || standingsLoading || scheduleLoading;
  const showStandingsWarning =
    standingsError && standings.length > 0 && !martStandings?.length;

  if (loading) {
    return (
      <Layout>
        <LoadingSkeleton />
      </Layout>
    );
  }

  if (driversError) {
    return (
      <Layout>
        <ErrorMessage title="Could not load drivers" message={driversError} />
      </Layout>
    );
  }

  if (scheduleError) {
    return (
      <Layout>
        <ErrorMessage title="Could not load schedule" message={scheduleError} />
      </Layout>
    );
  }

  if (!driversData) return null;

  const lastUpdated = driversData[0]?.ingested_at;

  return (
    <Layout lastUpdated={lastUpdated}>
      <div className="space-y-10">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-100">
            {year} constructors
          </h2>
          <p className="text-zinc-400 text-sm mt-1">
            {standings.length} teams · points summed per constructor
          </p>
        </div>

        <section>
          <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">
            Constructor standings
          </h3>
          {standingsError && standings.length === 0 && (
            <ErrorMessage
              title="Could not load constructor standings"
              message={standingsError}
            />
          )}
          {showStandingsWarning && (
            <p className="text-sm text-amber-400/90 mb-3">
              Using points summed from drivers (constructor mart unavailable).
            </p>
          )}
          {standings.length > 0 ? (
            <ConstructorStandingsTable
              standings={standings}
              teamColours={teamColours}
            />
          ) : (
            <p className="text-zinc-500 rounded-xl border border-zinc-800 bg-[#1c1c27] p-6">
              No constructor standings yet.
            </p>
          )}
        </section>

        <section>
          <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
            <div>
              <h3 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
                Teams & drivers
              </h3>
              <p className="text-xs text-zinc-500 mt-1">
                Grouped by team · driver points roll up to constructor total
              </p>
            </div>
            <input
              type="search"
              placeholder="Search team or driver…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#e10600]/50"
            />
          </div>

          {teams.length === 0 ? (
            <p className="text-zinc-500">No teams match your search.</p>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {teams.map(([teamName, teamDrivers]) => (
                <TeamDriversSection
                  key={teamName}
                  teamName={teamName}
                  drivers={teamDrivers}
                  teamColour={teamDrivers[0]?.team_colour}
                  allDrivers={drivers}
                  standings={standings}
                  weekends={weekends}
                />
              ))}
            </div>
          )}
        </section>

        <PipelineFooter />
      </div>
    </Layout>
  );
}

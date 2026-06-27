import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useSeason } from "../context/SeasonContext";
import { useDriversWithStandings } from "../hooks/useDriversWithStandings";
import { Layout } from "../components/layout/Layout";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { PipelineFooter } from "../components/layout/PipelineFooter";
import { DriverStandingsTable } from "../components/drivers/DriverStandingsTable";
import { uniqueDrivers, filterDrivers } from "../lib/driverUtils";

export function DriversPage() {
  const { year } = useSeason();
  const { data, loading, error } = useDriversWithStandings();
  const [search, setSearch] = useState("");

  const drivers = useMemo(() => (data ? uniqueDrivers(data) : []), [data]);
  const filtered = useMemo(
    () => filterDrivers(drivers, search),
    [drivers, search],
  );

  const leaderPoints = drivers[0]?.total_points ?? 0;

  if (loading) {
    return (
      <Layout>
        <LoadingSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <ErrorMessage title="Could not load driver standings" message={error} />
      </Layout>
    );
  }

  if (!data) return null;

  const lastUpdated =
    data?.[0]?.ingested_at ?? data?.find((d) => d.ingested_at)?.ingested_at;

  return (
    <Layout lastUpdated={lastUpdated}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-semibold text-zinc-100">
              {year} driver standings
            </h2>
            <p className="text-zinc-400 text-sm mt-1">
              {drivers.length} drivers · championship order by points
            </p>
            {drivers[0] && (
              <p className="text-sm text-zinc-500 mt-1">
                Leader: {drivers[0].full_name} ({leaderPoints} pts)
              </p>
            )}
          </div>
          <input
            type="search"
            placeholder="Search name, team, or number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#e10600]/50"
          />
        </div>

        <DriverStandingsTable
          drivers={filtered}
          championshipDrivers={drivers}
        />

        <p className="text-xs text-zinc-600">
          Browse drivers by team on the{" "}
          <Link to="/teams" className="text-[#e10600] hover:underline">
            Teams
          </Link>{" "}
          page.
        </p>

        <PipelineFooter />
      </div>
    </Layout>
  );
}

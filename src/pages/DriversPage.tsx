import { useMemo, useState } from "react";
import { useDrivers } from "../hooks/useDrivers";
import { Layout } from "../components/layout/Layout";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { PipelineFooter } from "../components/layout/PipelineFooter";
import { TeamDriversSection } from "../components/drivers/TeamDriversSection";
import { uniqueDrivers, groupByTeam, filterDrivers } from "../lib/driverUtils";

export function DriversPage() {
  const { data, loading, error } = useDrivers();
  const [search, setSearch] = useState("");

  const drivers = useMemo(() => (data ? uniqueDrivers(data) : []), [data]);
  const filtered = useMemo(
    () => filterDrivers(drivers, search),
    [drivers, search],
  );
  const teams = useMemo(() => groupByTeam(filtered), [filtered]);

  if (loading) {
    return (
      <Layout year={2026}>
        <LoadingSkeleton />
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout year={2026}>
        <ErrorMessage message={error} />
      </Layout>
    );
  }

  if (!data) return null;

  const lastUpdated = data[0]?.ingested_at;

  return (
    <Layout year={2026} lastUpdated={lastUpdated}>
      <div className="space-y-8">
        <div>
          <h2 className="text-2xl font-semibold text-zinc-100">2026 drivers</h2>
          <p className="text-zinc-400 text-sm mt-1">
            {drivers.length} drivers · {teams.length} teams
          </p>
          <input
            type="search"
            placeholder="Search by name, team, or number…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="mt-4 w-full max-w-md rounded-lg border border-zinc-700 bg-zinc-900 px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-[#e10600]/50"
          />
        </div>

        {teams.length === 0 ? (
          <p className="text-zinc-500">No drivers match your search.</p>
        ) : (
          <div className="space-y-10">
            {teams.map(([teamName, teamDrivers]) => (
              <TeamDriversSection
                key={teamName}
                teamName={teamName}
                drivers={teamDrivers}
                teamColour={teamDrivers[0]?.team_colour}
              />
            ))}
          </div>
        )}

        <PipelineFooter />
      </div>
    </Layout>
  );
}

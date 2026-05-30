import { useMemo } from "react";
import { useSchedule } from "../hooks/useSchedule";
import { useDrivers } from "../hooks/useDrivers";
import { Layout } from "../components/layout/Layout";
import { HeroSection } from "../components/dashboard/HeroSection";
import { RaceStrip } from "../components/dashboard/RaceStrip";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { FeaturedDrivers } from "../components/dashboard/FeaturedDrivers";
import { RaceWeekendList } from "../components/dashboard/RaceWeekendList";
import { PipelineFooter } from "../components/layout/PipelineFooter";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { getTopDriversByNumber, uniqueDrivers } from "../lib/driverUtils";
import {
  groupByMeeting,
  getRaceWeekends,
  getNextSession,
  getLiveSession,
  getAnchorWeekendIndex,
  getAdjacentWeekends,
  computeDashboardStats,
} from "../lib/scheduleUtils";

export function DashboardPage() {
  const { data: schedule, loading, error } = useSchedule();
  const {
    data: driversData,
    loading: driversLoading,
    error: driversError,
  } = useDrivers();

  const weekends = useMemo(
    () => (schedule ? groupByMeeting(schedule) : []),
    [schedule],
  );

  const raceWeekends = useMemo(() => getRaceWeekends(weekends), [weekends]);

  const nextSession = useMemo(
    () => (schedule ? getNextSession(schedule) : null),
    [schedule],
  );

  const liveSession = useMemo(
    () => (schedule ? getLiveSession(schedule) : null),
    [schedule],
  );

  const anchorIndex = useMemo(
    () => getAnchorWeekendIndex(raceWeekends, nextSession, liveSession),
    [raceWeekends, nextSession, liveSession],
  );

  const adjacent = useMemo(
    () => getAdjacentWeekends(raceWeekends, anchorIndex),
    [raceWeekends, anchorIndex],
  );

  const stats = useMemo(() => {
    const driverCount = driversData ? uniqueDrivers(driversData).length : 0;
    return computeDashboardStats(raceWeekends, driverCount);
  }, [raceWeekends, driversData]);

  const featuredDrivers = useMemo(
    () => (driversData ? getTopDriversByNumber(driversData, 5) : []),
    [driversData],
  );

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

  if (!schedule) return null;

  const lastUpdated = schedule[0]?.ingested_at;

  return (
    <Layout year={2026} lastUpdated={lastUpdated}>
      <div className="space-y-10">
        <HeroSection
          weekend={adjacent.current}
          nextSession={nextSession}
          liveSession={liveSession}
        />

        <RaceStrip
          previous={adjacent.previous}
          current={adjacent.current}
          next={adjacent.next}
        />

        <DashboardStats {...stats} />

        {driversError ? (
          <p className="text-sm text-red-400">
            Could not load drivers: {driversError}
          </p>
        ) : (
          <FeaturedDrivers drivers={featuredDrivers} loading={driversLoading} />
        )}

        <section id="calendar">
          <h2 className="text-lg font-semibold mb-4 text-zinc-300">
            2026 calendar
          </h2>
          <RaceWeekendList weekends={weekends} />
        </section>

        <PipelineFooter />
      </div>
    </Layout>
  );
}

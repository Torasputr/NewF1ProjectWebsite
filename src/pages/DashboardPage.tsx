import { useMemo } from "react";
import { useSeason } from "../context/SeasonContext";
import { useSchedule } from "../hooks/useSchedule";
import { useDrivers } from "../hooks/useDrivers";
import { useSessionResults } from "../hooks/useSessionResults";
import { Layout } from "../components/layout/Layout";
import { HeroSection } from "../components/dashboard/HeroSection";
import { RaceStrip } from "../components/dashboard/RaceStrip";
import { DashboardStats } from "../components/dashboard/DashboardStats";
import { FeaturedDrivers } from "../components/dashboard/FeaturedDrivers";
import { RaceWeekendList } from "../components/dashboard/RaceWeekendList";
import { PipelineFooter } from "../components/layout/PipelineFooter";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { getTopDriversByPoints, uniqueDrivers } from "../lib/driverUtils";
import { getLocalTimeZoneLabel } from "../lib/dateTimeFormat";
import { buildPodiumByMeeting, getHeroSessionPodiumsForMeeting } from "../lib/sessionResultUtils";
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
  const { year } = useSeason();
  const { data: schedule, loading, error } = useSchedule();
  const {
    data: driversData,
    loading: driversLoading,
    error: driversError,
  } = useDrivers();
  const { data: sessionResults } = useSessionResults();

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
    () => (driversData ? getTopDriversByPoints(driversData, 3) : []),
    [driversData],
  );

  const uniqueDriverList = useMemo(
    () => (driversData ? uniqueDrivers(driversData) : []),
    [driversData],
  );

  const podiumByMeeting = useMemo(() => {
    if (!sessionResults || !driversData) return new Map();
    return buildPodiumByMeeting(sessionResults, raceWeekends, driversData);
  }, [sessionResults, driversData, raceWeekends]);

  const focusMeetingKey = liveSession?.meeting_key ?? nextSession?.meeting_key;

  const heroSessionPodiums = useMemo(() => {
    if (!adjacent.current || !sessionResults || uniqueDriverList.length === 0) {
      return null;
    }
    return getHeroSessionPodiumsForMeeting(
      adjacent.current,
      raceWeekends,
      sessionResults,
      uniqueDriverList,
    );
  }, [adjacent.current, raceWeekends, sessionResults, uniqueDriverList]);

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
        <ErrorMessage title="Could not load schedule" message={error} />
      </Layout>
    );
  }

  if (!schedule) return null;

  const lastUpdated = schedule[0]?.ingested_at;

  return (
    <Layout lastUpdated={lastUpdated}>
      <div className="space-y-10">
        <HeroSection
          weekend={adjacent.current}
          nextSession={nextSession}
          liveSession={liveSession}
          lastSessionPodiums={heroSessionPodiums}
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
          <h2 className="text-lg font-semibold text-zinc-300">{year} calendar</h2>
          <p className="text-xs text-zinc-600 mb-4">
            Session times in your local timezone
            {getLocalTimeZoneLabel() ? ` (${getLocalTimeZoneLabel()})` : ""}
          </p>
          <RaceWeekendList
            weekends={weekends}
            focusMeetingKey={focusMeetingKey}
            podiumByMeeting={podiumByMeeting}
          />
        </section>

        <PipelineFooter />
      </div>
    </Layout>
  );
}

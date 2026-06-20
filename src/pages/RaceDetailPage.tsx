import { useEffect, useMemo, useRef } from "react";
import { Link, useParams, useSearchParams } from "react-router-dom";
import {
  formatWeekendRange,
  getLocalTimeZoneLabel,
} from "../lib/dateTimeFormat";
import { useSchedule } from "../hooks/useSchedule";
import { useDrivers } from "../hooks/useDrivers";
import { useSessionResults } from "../hooks/useSessionResults";
import { Layout } from "../components/layout/Layout";
import { LoadingSkeleton } from "../components/ui/LoadingSkeleton";
import { ErrorMessage } from "../components/ui/ErrorMessage";
import { SessionResultsTable } from "../components/race/SessionResultsTable";
import { QualiResultsTable } from "../components/race/QualiResultsTable";
import { PracticeResultsTable } from "../components/race/PracticeResultsTable";
import { SessionRow } from "../components/ui/SessionRow";
import {
  groupByMeeting,
  isMeetingCancelled,
} from "../lib/scheduleUtils";
import {
  getResultsByMeeting,
  groupResultsBySession,
  isQualifyingResult,
  isPracticeResult,
} from "../lib/sessionResultUtils";
import { uniqueDrivers } from "../lib/driverUtils";

export function RaceDetailPage() {
  const { meetingKey } = useParams<{ meetingKey: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const meetingKeyNum = Number(meetingKey);

  const sessionFromUrl = searchParams.get("session");
  const urlSessionKey = sessionFromUrl ? Number(sessionFromUrl) : null;

  const scrolledRef = useRef(false);

  const {
    data: schedule,
    loading: scheduleLoading,
    error: scheduleError,
  } = useSchedule();
  const {
    data: results,
    loading: resultsLoading,
    error: resultsError,
  } = useSessionResults();
  const { data: driversData, loading: driversLoading } = useDrivers();

  const weekend = useMemo(() => {
    if (!schedule || Number.isNaN(meetingKeyNum)) return null;
    return (
      groupByMeeting(schedule).find(
        (w) => Number(w.meeting_key) === meetingKeyNum,
      ) ?? null
    );
  }, [schedule, meetingKeyNum]);

  const sessionGroups = useMemo(() => {
    if (!results || Number.isNaN(meetingKeyNum)) return [];
    return groupResultsBySession(getResultsByMeeting(results, meetingKeyNum));
  }, [results, meetingKeyNum]);

  const selectedSessionKey = useMemo(() => {
    if (
      urlSessionKey != null &&
      !Number.isNaN(urlSessionKey) &&
      sessionGroups.some((g) => Number(g.session_key) === urlSessionKey)
    ) {
      return urlSessionKey;
    }
    const raceGroup = sessionGroups.find((g) => g.session_type === "Race");
    const first = raceGroup ?? sessionGroups[0];
    return first != null ? Number(first.session_key) : null;
  }, [urlSessionKey, sessionGroups]);

  const activeGroup = sessionGroups.find(
    (g) => Number(g.session_key) === selectedSessionKey,
  );

  const drivers = useMemo(
    () => (driversData ? uniqueDrivers(driversData) : []),
    [driversData],
  );

  const selectSession = (sessionKey: number) => {
    setSearchParams({ session: String(sessionKey) });
  };

  useEffect(() => {
    scrolledRef.current = false;
  }, [meetingKey]);

  useEffect(() => {
    if (!urlSessionKey || sessionGroups.length === 0 || scrolledRef.current) {
      return;
    }
    scrolledRef.current = true;
    document.getElementById("session-results")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  }, [urlSessionKey, sessionGroups.length]);

  const loading = scheduleLoading || resultsLoading || driversLoading;

  if (loading) {
    return (
      <Layout>
        <LoadingSkeleton />
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

  if (!weekend) {
    return (
      <Layout>
        <ErrorMessage
          title="Race weekend not found"
          message={`No meeting found for id "${meetingKey}".`}
        />
        <Link to="/" className="text-[#e10600] text-sm mt-4 inline-block">
          ← Back to calendar
        </Link>
      </Layout>
    );
  }

  const cancelled = isMeetingCancelled(weekend);

  const urlSessionInvalid =
    urlSessionKey != null &&
    !Number.isNaN(urlSessionKey) &&
    sessionGroups.length > 0 &&
    !sessionGroups.some((g) => Number(g.session_key) === urlSessionKey);

  const showQualiTable =
    activeGroup &&
    activeGroup.rows.length > 0 &&
    isQualifyingResult(activeGroup.rows[0]);

  const showPracticeTable =
    activeGroup &&
    activeGroup.rows.length > 0 &&
    isPracticeResult(activeGroup.rows[0]);

  const showRaceTable =
    activeGroup &&
    activeGroup.rows.length > 0 &&
    !showQualiTable &&
    !showPracticeTable;

  return (
    <Layout>
      <div className="space-y-8">
        <Link
          to="/"
          className="text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          ← Back to calendar
        </Link>

        <header className="relative overflow-hidden rounded-2xl border border-zinc-800 bg-gradient-to-br from-[#1c1c27] to-[#15151e] p-6 sm:p-8">
          {weekend.circuit_image && (
            <img
              src={weekend.circuit_image}
              alt=""
              className="absolute right-0 top-0 h-full max-h-48 opacity-[0.1] pointer-events-none select-none"
            />
          )}
          <div className="relative flex items-center gap-3">
            <img
              src={weekend.country_flag}
              alt=""
              className="w-10 h-7 object-cover rounded-sm"
            />
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100">
                {weekend.meeting_name}
              </h1>
              <p className="text-zinc-400 mt-1">
                {weekend.circuit_short_name} · {weekend.location}
              </p>
              <p className="text-sm text-zinc-500 mt-1">
                {formatWeekendRange(weekend.weekendStart, weekend.weekendEnd)}
              </p>
            </div>
          </div>
          {cancelled && (
            <p className="mt-4 text-sm text-red-400 font-medium">
              This meeting has been cancelled.
            </p>
          )}
        </header>

        <section>
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
            Weekend schedule
          </h2>
          <p className="text-xs text-zinc-600 mb-3">
            Times in your local timezone
            {getLocalTimeZoneLabel() ? ` (${getLocalTimeZoneLabel()})` : ""}
          </p>
          <div className="rounded-xl border border-zinc-800 bg-[#1c1c27] px-4 py-2">
            {weekend.sessions.map((s) => (
              <SessionRow key={s.session_key} session={s} />
            ))}
          </div>
        </section>

        <section id="session-results">
          <div className="flex flex-wrap items-baseline justify-between gap-2 mb-3">
            <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
              Session results
            </h2>
            {activeGroup && (
              <p className="text-sm text-zinc-300">
                {activeGroup.session_name}
              </p>
            )}
          </div>

          {resultsError && (
            <ErrorMessage
              title="Could not load results"
              message={resultsError}
            />
          )}

          {!resultsError && sessionGroups.length === 0 && (
            <p className="text-zinc-500 rounded-xl border border-zinc-800 bg-[#1c1c27] p-6">
              No session results for this meeting yet.
            </p>
          )}

          {!resultsError && urlSessionInvalid && (
            <p className="text-zinc-500 rounded-xl border border-zinc-800 bg-[#1c1c27] p-6 mb-4">
              No results for this session yet.
            </p>
          )}

          {sessionGroups.length > 0 && (
            <>
              {sessionGroups.length > 1 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {sessionGroups.map((g) => (
                    <button
                      key={g.session_key}
                      type="button"
                      onClick={() => selectSession(Number(g.session_key))}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                        Number(g.session_key) === selectedSessionKey
                          ? "bg-[#e10600] text-white"
                          : "bg-zinc-800 text-zinc-300 hover:bg-zinc-700"
                      }`}
                    >
                      {g.session_name}
                    </button>
                  ))}
                </div>
              )}

              {showQualiTable && activeGroup && (
                <QualiResultsTable
                  rows={activeGroup.rows}
                  drivers={drivers}
                />
              )}

              {showPracticeTable && activeGroup && (
                <PracticeResultsTable
                  rows={activeGroup.rows}
                  drivers={drivers}
                />
              )}

              {showRaceTable && activeGroup && (
                <SessionResultsTable
                  rows={activeGroup.rows}
                  drivers={drivers}
                />
              )}
            </>
          )}
        </section>
      </div>
    </Layout>
  );
}

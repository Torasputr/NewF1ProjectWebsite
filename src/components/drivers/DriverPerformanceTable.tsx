import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import type { DriverSessionResult } from "../../lib/driverPerformanceUtils";
import {
  buildQualiPositionIndex,
  compareQualiToRace,
  DEFAULT_SESSION_HISTORY_FILTERS,
  filterSessionsByCategories,
  formatDriverSessionResult,
  getSessionHistoryCategory,
  SESSION_HISTORY_FILTERS,
  type QualiCompareMode,
  type QualiRaceComparison,
  type SessionHistoryCategory,
} from "../../lib/driverPerformanceUtils";
import { driverStatus, isQualifyingResult } from "../../lib/sessionResultUtils";
import { sessionShortLabel } from "../../lib/scheduleUtils";
import { formatSessionDateTime } from "../../lib/dateTimeFormat";

type DriverPerformanceTableProps = {
  sessions: DriverSessionResult[];
};

function SessionFilterCheckbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: SessionHistoryCategory;
  label: string;
  checked: boolean;
  onChange: (id: SessionHistoryCategory, checked: boolean) => void;
}) {
  return (
    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(id, e.target.checked)}
        className="sr-only peer"
      />
      <span
        className={`w-4 h-4 rounded border flex items-center justify-center transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-[#e10600]/50 ${
          checked
            ? "bg-[#e10600] border-[#e10600]"
            : "border-zinc-600 bg-zinc-900"
        }`}
        aria-hidden
      >
        {checked && (
          <svg
            className="w-2.5 h-2.5 text-white"
            viewBox="0 0 12 12"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path d="M2 6l3 3 5-6" />
          </svg>
        )}
      </span>
      <span
        className={`text-sm ${checked ? "text-zinc-200" : "text-zinc-500"}`}
      >
        {label}
      </span>
    </label>
  );
}

function conversionLabel(conversion: QualiRaceComparison["placesConversion"]) {
  if (conversion === "better") return "Better";
  if (conversion === "similar") return "Same";
  return "Worse";
}

function conversionColor(conversion: QualiRaceComparison["placesConversion"]) {
  if (conversion === "better") return "text-emerald-400";
  if (conversion === "similar") return "text-zinc-400";
  return "text-rose-400";
}

function QualiConversionCell({
  comparison,
  mode,
}: {
  comparison: QualiRaceComparison | null;
  mode: QualiCompareMode;
}) {
  if (!comparison) {
    return <span className="text-zinc-600">—</span>;
  }

  const { qualiPosition, gridPoints } = comparison;

  if (mode === "places") {
    const { placesConversion, placesDelta } = comparison;
    const deltaText =
      placesConversion === "similar"
        ? "0"
        : placesDelta > 0
          ? `+${placesDelta}`
          : String(placesDelta);

    return (
      <div className="flex flex-col gap-0.5">
        <span className="font-mono text-zinc-500 text-xs">
          Grid P{qualiPosition}
        </span>
        <span
          className={`text-xs font-medium ${conversionColor(placesConversion)}`}
        >
          {conversionLabel(placesConversion)} ({deltaText})
        </span>
      </div>
    );
  }

  const { pointsConversion, pointsDelta, actualPoints } = comparison;
  const deltaText =
    pointsConversion === "similar"
      ? "0"
      : pointsDelta > 0
        ? `+${pointsDelta}`
        : String(pointsDelta);

  return (
    <div className="flex flex-col gap-0.5">
      <span className="font-mono text-zinc-500 text-xs">
        Grid {gridPoints} pts · scored {actualPoints}
      </span>
      <span
        className={`text-xs font-medium ${conversionColor(pointsConversion)}`}
      >
        {conversionLabel(pointsConversion)} ({deltaText} pts)
      </span>
    </div>
  );
}

function QualiCompareToggle({
  mode,
  onChange,
}: {
  mode: QualiCompareMode;
  onChange: (mode: QualiCompareMode) => void;
}) {
  return (
    <div
      className="inline-flex rounded-lg border border-zinc-700 bg-zinc-900 p-0.5"
      role="group"
      aria-label="Compare race to qualifying by"
    >
      {(
        [
          { id: "places" as const, label: "Places" },
          { id: "points" as const, label: "Points" },
        ] as const
      ).map(({ id, label }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`px-2.5 py-1 text-xs rounded-md transition-colors ${
            mode === id
              ? "bg-[#e10600] text-white font-medium"
              : "text-zinc-400 hover:text-zinc-200"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export function DriverPerformanceTable({
  sessions,
}: DriverPerformanceTableProps) {
  const [filters, setFilters] = useState(DEFAULT_SESSION_HISTORY_FILTERS);
  const [qualiCompareMode, setQualiCompareMode] =
    useState<QualiCompareMode>("places");

  const qualiIndex = useMemo(
    () => buildQualiPositionIndex(sessions),
    [sessions],
  );

  const visibleFilters = useMemo(() => {
    const present = new Set(
      sessions.map((row) => getSessionHistoryCategory(row)),
    );
    return SESSION_HISTORY_FILTERS.filter((f) => present.has(f.id));
  }, [sessions]);

  const filteredSessions = useMemo(
    () => filterSessionsByCategories(sessions, filters),
    [sessions, filters],
  );

  const anyFilterOn = Object.values(filters).some(Boolean);
  const noneSelected = !anyFilterOn;

  const toggleFilter = (id: SessionHistoryCategory, checked: boolean) => {
    setFilters((prev) => ({ ...prev, [id]: checked }));
  };

  const selectAll = () => {
    setFilters({ ...DEFAULT_SESSION_HISTORY_FILTERS });
  };

  if (sessions.length === 0) {
    return (
      <p className="text-zinc-500 rounded-xl border border-zinc-800 bg-[#1c1c27] p-6">
        No session results recorded for this driver yet.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-x-5 gap-y-2 rounded-xl border border-zinc-800 bg-[#1c1c27] px-4 py-3">
        <span className="text-xs text-zinc-500 uppercase tracking-wide w-full sm:w-auto">
          Show
        </span>
        {visibleFilters.map((f) => (
          <SessionFilterCheckbox
            key={f.id}
            id={f.id}
            label={f.label}
            checked={filters[f.id]}
            onChange={toggleFilter}
          />
        ))}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:ml-auto">
          <span className="text-xs text-zinc-500 uppercase tracking-wide">
            vs Quali
          </span>
          <QualiCompareToggle
            mode={qualiCompareMode}
            onChange={setQualiCompareMode}
          />
        </div>
        <button
          type="button"
          onClick={selectAll}
          className="text-xs text-zinc-500 hover:text-[#e10600] transition-colors sm:ml-2"
        >
          Select all
        </button>
      </div>

      <p className="text-xs text-zinc-600">
        {noneSelected
          ? "Select at least one session type"
          : `${filteredSessions.length} of ${sessions.length} sessions`}
      </p>

      {noneSelected ? (
        <p className="text-zinc-500 rounded-xl border border-zinc-800 bg-[#1c1c27] p-6">
          Turn on a filter above to see session results.
        </p>
      ) : filteredSessions.length === 0 ? (
        <p className="text-zinc-500 rounded-xl border border-zinc-800 bg-[#1c1c27] p-6">
          No sessions match the selected filters.
        </p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-800">
          <table className="w-full text-sm text-left min-w-[640px]">
            <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-xs">
              <tr>
                <th className="px-4 py-3">Round</th>
                <th className="px-4 py-3">Session</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Pos</th>
                <th className="px-4 py-3 hidden sm:table-cell">vs Quali</th>
                <th className="px-4 py-3">Pts</th>
                <th className="px-4 py-3">Time</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredSessions.map((row) => {
                const status = driverStatus(row);
                const isQuali = isQualifyingResult(row);
                const isRaceSession =
                  getSessionHistoryCategory(row) === "race" ||
                  getSessionHistoryCategory(row) === "sprint";
                const qualiComparison = isRaceSession
                  ? compareQualiToRace(row, qualiIndex)
                  : null;
                const label = sessionShortLabel(
                  row.session_type,
                  row.session_name,
                );
                const positionClass =
                  row.position === 1
                    ? "text-amber-300 font-bold"
                    : row.position <= 3 && !isQuali
                      ? "text-zinc-200 font-semibold"
                      : "text-zinc-400";

                return (
                  <tr
                    key={`${row.session_key}-${row.driver_number}`}
                    className="border-t border-zinc-800 hover:bg-zinc-900/40"
                  >
                    <td className="px-4 py-3">
                      <Link
                        to={`/race/${row.meeting_key}?session=${row.session_key}`}
                        className="text-zinc-200 hover:text-[#e10600] transition-colors font-medium"
                      >
                        {row.meeting_name}
                      </Link>
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-zinc-500 mr-2">
                        {label}
                      </span>
                      <span className="text-zinc-400">{row.session_name}</span>
                    </td>
                    <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
                      {formatSessionDateTime(row.date_start)}
                    </td>
                    <td
                      className={`px-4 py-3 font-mono tabular-nums ${positionClass}`}
                    >
                      P{row.position}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <QualiConversionCell
                        comparison={qualiComparison}
                        mode={qualiCompareMode}
                      />
                    </td>
                    <td className="px-4 py-3 tabular-nums text-zinc-300">
                      {isQuali || row.session_type === "Practice"
                        ? "—"
                        : (row.points ?? 0)}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-zinc-300">
                      {formatDriverSessionResult(row)}
                    </td>
                    <td className="px-4 py-3">
                      {status ? (
                        <span className="text-xs font-medium text-amber-400">
                          {status}
                        </span>
                      ) : (
                        <span className="text-zinc-600">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

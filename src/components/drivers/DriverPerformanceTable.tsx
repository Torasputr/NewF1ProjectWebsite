import { Link } from "react-router-dom";
import type { DriverSessionResult } from "../../lib/driverPerformanceUtils";
import { formatDriverSessionResult } from "../../lib/driverPerformanceUtils";
import {
  driverStatus,
  isQualifyingResult,
} from "../../lib/sessionResultUtils";
import { sessionShortLabel } from "../../lib/scheduleUtils";
import { formatSessionDateTime } from "../../lib/dateTimeFormat";

type DriverPerformanceTableProps = {
  sessions: DriverSessionResult[];
};

export function DriverPerformanceTable({
  sessions,
}: DriverPerformanceTableProps) {
  if (sessions.length === 0) {
    return (
      <p className="text-zinc-500 rounded-xl border border-zinc-800 bg-[#1c1c27] p-6">
        No race or qualifying results recorded for this driver yet.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-sm text-left min-w-[560px]">
        <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Round</th>
            <th className="px-4 py-3">Session</th>
            <th className="px-4 py-3">Date</th>
            <th className="px-4 py-3">Pos</th>
            <th className="px-4 py-3">Pts</th>
            <th className="px-4 py-3">Time</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {sessions.map((row) => {
            const status = driverStatus(row);
            const isQuali = isQualifyingResult(row);
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
                  <span className="font-mono text-zinc-500 mr-2">{label}</span>
                  <span className="text-zinc-400">{row.session_name}</span>
                </td>
                <td className="px-4 py-3 text-zinc-500 text-xs whitespace-nowrap">
                  {formatSessionDateTime(row.date_start)}
                </td>
                <td className={`px-4 py-3 font-mono tabular-nums ${positionClass}`}>
                  P{row.position}
                </td>
                <td className="px-4 py-3 tabular-nums text-zinc-300">
                  {isQuali ? "—" : (row.points ?? 0)}
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
  );
}

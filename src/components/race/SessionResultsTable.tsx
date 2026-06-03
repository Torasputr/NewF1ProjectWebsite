import type { Driver } from "../../types/driver";
import type { SessionResultRow } from "../../types/sessionResults";
import {
  buildDriverMap,
  formatGap,
  formatRaceTime,
  driverStatus,
} from "../../lib/sessionResultUtils";

type SessionResultsTableProps = {
  rows: SessionResultRow[];
  drivers: Driver[];
};

export function SessionResultsTable({
  rows,
  drivers,
}: SessionResultsTableProps) {
  const driverMap = buildDriverMap(drivers);

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-sm text-left">
        <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Pos</th>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Driver</th>
            <th className="px-4 py-3 hidden sm:table-cell">Team</th>
            <th className="px-4 py-3">Laps</th>
            <th className="px-4 py-3">Time / Gap</th>
            <th className="px-4 py-3">Pts</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const driver = driverMap.get(row.driver_number);
            const status = driverStatus(row);
            const timeOrGap =
              row.position === 1
                ? formatRaceTime(row.duration ?? null)
                : formatGap(row.gap_to_leader ?? null, row.position);

            return (
              <tr
                key={`${row.session_key}-${row.driver_number}`}
                className="border-t border-zinc-800 hover:bg-zinc-900/40"
              >
                <td className="px-4 py-3 font-mono text-zinc-300">
                  {row.position}
                </td>
                <td className="px-4 py-3 font-mono text-zinc-500">
                  {row.driver_number}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    {driver && (
                      <span
                        className="w-1 h-8 rounded-full shrink-0"
                        style={{ backgroundColor: driver.team_colour }}
                      />
                    )}
                    <span className="font-medium text-zinc-100">
                      {driver?.full_name ?? `Driver ${row.driver_number}`}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-zinc-400 hidden sm:table-cell">
                  {driver?.team_name ?? "—"}
                </td>
                <td className="px-4 py-3 text-zinc-400">
                  {row.number_of_laps ?? "—"}
                </td>
                <td className="px-4 py-3 font-mono text-zinc-300">
                  {timeOrGap}
                </td>
                <td className="px-4 py-3 text-zinc-300">{row.points ?? 0}</td>
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

import type { Driver } from "../../types/driver";
import type { SessionResultRow } from "../../types/sessionResults";
import {
  buildDriverMap,
  driverStatus,
  formatLapTime,
} from "../../lib/sessionResultUtils";

type QualiResultsTableProps = {
  rows: SessionResultRow[];
  drivers: Driver[];
};

function LapCell({ value }: { value: number | null | undefined }) {
  const text = formatLapTime(value ?? null);
  return (
    <td
      className={`px-3 py-3 font-mono text-xs ${
        text === "—" ? "text-zinc-600" : "text-zinc-200"
      }`}
    >
      {text}
    </td>
  );
}

export function QualiResultsTable({ rows, drivers }: QualiResultsTableProps) {
  const driverMap = buildDriverMap(drivers);

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-sm text-left min-w-[640px]">
        <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3">Pos</th>
            <th className="px-4 py-3">#</th>
            <th className="px-4 py-3">Driver</th>
            <th className="px-4 py-3 hidden sm:table-cell">Team</th>
            <th className="px-3 py-3">Q1</th>
            <th className="px-3 py-3">Q2</th>
            <th className="px-3 py-3">Q3</th>
            <th className="px-3 py-3">Best</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const driver = driverMap.get(row.driver_number);
            const status = driverStatus(row);

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
                <LapCell value={row.q1} />
                <LapCell value={row.q2} />
                <LapCell value={row.q3} />
                <td className="px-3 py-3 font-mono text-xs text-[#e10600] font-medium">
                  {formatLapTime(row.best_lap_time ?? null)}
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

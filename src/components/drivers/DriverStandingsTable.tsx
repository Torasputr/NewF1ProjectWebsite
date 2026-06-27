import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import type { Driver } from "../../types/driver";
import { uniqueDrivers } from "../../lib/driverUtils";

type DriverStandingsTableProps = {
  /** Rows to display (may be search-filtered). */
  drivers: Driver[];
  /** Full grid for championship position and gap to leader. */
  championshipDrivers: Driver[];
};

function positionClass(position: number): string {
  if (position === 1) return "text-amber-300 font-bold";
  if (position <= 3) return "text-zinc-200 font-semibold";
  return "text-zinc-400";
}

export function DriverStandingsTable({
  drivers,
  championshipDrivers,
}: DriverStandingsTableProps) {
  const navigate = useNavigate();

  const { leaderPoints, positionByNumber } = useMemo(() => {
    const sorted = uniqueDrivers(championshipDrivers);
    return {
      leaderPoints: sorted[0]?.total_points ?? 0,
      positionByNumber: new Map(
        sorted.map((d, index) => [d.driver_number, index + 1]),
      ),
    };
  }, [championshipDrivers]);

  const rows = useMemo(
    () =>
      [...drivers].sort(
        (a, b) =>
          b.total_points - a.total_points || a.driver_number - b.driver_number,
      ),
    [drivers],
  );

  if (rows.length === 0) {
    return (
      <p className="text-zinc-500 rounded-xl border border-zinc-800 bg-[#1c1c27] p-6">
        {championshipDrivers.length === 0
          ? "No driver standings yet."
          : "No drivers match your search."}
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-sm text-left min-w-[520px]">
        <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 w-12">Pos</th>
            <th className="px-4 py-3">Driver</th>
            <th className="px-4 py-3 hidden md:table-cell">Team</th>
            <th className="px-4 py-3 text-right">Points</th>
            <th className="px-4 py-3 text-right hidden sm:table-cell">Gap</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((driver) => {
            const position =
              positionByNumber.get(driver.driver_number) ?? 0;
            const gap =
              position === 1 ? null : leaderPoints - driver.total_points;

            return (
              <tr
                key={driver.driver_number}
                onClick={() =>
                  navigate(`/drivers/${driver.driver_number}`)
                }
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    navigate(`/drivers/${driver.driver_number}`);
                  }
                }}
                tabIndex={0}
                role="link"
                className="border-t border-zinc-800 hover:bg-zinc-900/40 cursor-pointer focus:outline-none focus-visible:bg-zinc-900/60"
              >
                <td
                  className={`px-4 py-3 font-mono tabular-nums ${positionClass(position)}`}
                >
                  {position}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={driver.headshot_url}
                      alt=""
                      className="w-9 h-9 rounded-full object-cover bg-zinc-800 shrink-0 ring-1 ring-zinc-700"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.visibility =
                          "hidden";
                      }}
                    />
                    <div className="min-w-0">
                      <p className="font-medium text-zinc-100 truncate">
                        {driver.full_name}
                      </p>
                      <p className="text-xs text-zinc-500 font-mono">
                        #{driver.driver_number} · {driver.name_acronym}
                        <span className="md:hidden">
                          {" "}
                          · {driver.team_name}
                        </span>
                      </p>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 hidden md:table-cell">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-1 h-7 rounded-full shrink-0"
                      style={{ backgroundColor: driver.team_colour }}
                      aria-hidden
                    />
                    <span className="text-zinc-300 truncate">
                      {driver.team_name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-bold text-[#e10600] tabular-nums">
                  {driver.total_points}
                </td>
                <td className="px-4 py-3 text-right text-zinc-500 tabular-nums hidden sm:table-cell">
                  {gap == null ? "—" : `-${gap}`}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

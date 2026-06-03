import type { ConstructorStanding } from "../../types/constructorStanding";

type ConstructorStandingsTableProps = {
  standings: ConstructorStanding[];
  teamColours: Map<string, string>;
};

export function ConstructorStandingsTable({
  standings,
  teamColours,
}: ConstructorStandingsTableProps) {
  const leaderPoints = standings[0]?.total_points ?? 0;

  return (
    <div className="overflow-x-auto rounded-xl border border-zinc-800">
      <table className="w-full text-sm text-left">
        <thead className="bg-zinc-900/80 text-zinc-400 uppercase text-xs">
          <tr>
            <th className="px-4 py-3 w-12">Pos</th>
            <th className="px-4 py-3">Constructor</th>
            <th className="px-4 py-3 text-right">Points</th>
            <th className="px-4 py-3 hidden sm:table-cell">Gap</th>
          </tr>
        </thead>
        <tbody>
          {standings.map((row, index) => {
            const position = index + 1;
            const colour = teamColours.get(row.team_name) ?? "#71717a";
            const gap =
              position === 1 ? null : leaderPoints - row.total_points;

            return (
              <tr
                key={row.team_name}
                className="border-t border-zinc-800 hover:bg-zinc-900/40"
              >
                <td className="px-4 py-3 font-mono text-zinc-300">
                  {position}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-1 h-8 rounded-full shrink-0"
                      style={{ backgroundColor: colour }}
                      aria-hidden
                    />
                    <span className="font-medium text-zinc-100">
                      {row.team_name}
                    </span>
                  </div>
                </td>
                <td className="px-4 py-3 text-right font-bold text-[#e10600] tabular-nums">
                  {row.total_points}
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

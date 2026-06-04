import { Link } from "react-router-dom";
import type { Driver } from "../../types/driver";

type TeamDriverTileProps = {
  driver: Driver;
  championshipPosition?: number | null;
};

export function TeamDriverTile({
  driver,
  championshipPosition,
}: TeamDriverTileProps) {
  return (
    <Link
      to={`/drivers/${driver.driver_number}`}
      className="flex items-center gap-3 rounded-lg border border-zinc-800/80 bg-zinc-900/40 px-3 py-3 hover:border-zinc-600 hover:bg-zinc-900/70 transition-colors group min-w-0"
    >
      <img
        src={driver.headshot_url}
        alt=""
        className="w-14 h-14 rounded-full object-cover bg-zinc-800 shrink-0 ring-1 ring-zinc-700"
        onError={(e) => {
          (e.target as HTMLImageElement).style.visibility = "hidden";
        }}
      />
      <div className="min-w-0 flex-1">
        <div className="flex items-baseline justify-between gap-2">
          <p className="font-semibold text-zinc-100 truncate group-hover:text-white">
            {driver.full_name}
          </p>
          <p className="text-sm font-bold text-[#e10600] tabular-nums shrink-0">
            {driver.total_points}
          </p>
        </div>
        <p className="text-xs text-zinc-500 mt-0.5">
          <span className="font-mono">#{driver.driver_number}</span>
          {" · "}
          {driver.name_acronym}
          {championshipPosition != null && (
            <>
              {" · "}
              <span className="text-zinc-400">P{championshipPosition}</span>
            </>
          )}
        </p>
      </div>
    </Link>
  );
}

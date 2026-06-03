import { Link } from "react-router-dom";
import type { Driver } from "../../types/driver";

type DriverCardProps = {
  driver: Driver;
  showStanding?: boolean;
};

export function DriverCard({ driver, showStanding = true }: DriverCardProps) {
  return (
    <Link
      to={`/drivers/${driver.driver_number}`}
      className="block rounded-xl border border-zinc-800 bg-[#1c1c27] overflow-hidden hover:border-zinc-600 hover:bg-zinc-900/50 transition-colors group"
    >
      <div className="h-1" style={{ backgroundColor: driver.team_colour }} />
      <div className="p-4 flex gap-4 items-center">
        <img
          src={driver.headshot_url}
          alt=""
          className="w-16 h-16 rounded-full object-cover bg-zinc-800 shrink-0"
          onError={(e) => {
            (e.target as HTMLImageElement).style.visibility = "hidden";
          }}
        />
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-2">
            <p className="text-xs text-zinc-500 font-mono">
              #{driver.driver_number}
            </p>
            {showStanding && (
              <p className="text-lg font-bold text-[#e10600] tabular-nums shrink-0">
                {driver.total_points}{" "}
                <span className="text-[10px] font-normal text-zinc-500">
                  pts
                </span>
              </p>
            )}
          </div>
          <h3 className="font-semibold text-zinc-100 truncate group-hover:text-white">
            {driver.full_name}
          </h3>
          <p className="text-sm text-zinc-400">{driver.name_acronym}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{driver.country_code}</p>
          <p className="text-[10px] text-zinc-600 mt-2 group-hover:text-[#e10600] transition-colors">
            View profile →
          </p>
        </div>
      </div>
    </Link>
  );
}

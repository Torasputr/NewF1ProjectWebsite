import { Link } from "react-router-dom";
import type { Driver } from "../../types/driver";

type FeaturedDriversProps = {
  drivers: Driver[];
  loading?: boolean;
};

export function FeaturedDrivers({ drivers, loading }: FeaturedDriversProps) {
  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-2 mb-3">
        <div>
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
            Featured drivers
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">
            By car number · standings coming soon
          </p>
        </div>
        <Link
          to="/drivers"
          className="text-sm text-[#e10600] hover:text-red-400 transition-colors"
        >
          View all drivers →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="h-36 rounded-xl bg-zinc-800/50 animate-pulse"
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          {drivers.map((driver) => (
            <FeaturedDriverCard key={driver.driver_number} driver={driver} />
          ))}
        </div>
      )}
    </section>
  );
}

function FeaturedDriverCard({ driver }: { driver: Driver }) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-[#1c1c27] overflow-hidden">
      <div className="h-1" style={{ backgroundColor: driver.team_colour }} />
      <div className="p-3 flex flex-col items-center text-center">
        <img
          src={driver.headshot_url}
          alt=""
          className="w-14 h-14 rounded-full object-cover bg-zinc-800"
          onError={(e) => {
            (e.target as HTMLImageElement).style.visibility = "hidden";
          }}
        />
        <p className="text-xs font-mono text-zinc-500 mt-2">
          #{driver.driver_number}
        </p>
        <p className="font-semibold text-sm text-zinc-100 truncate w-full">
          {driver.broadcast_name}
        </p>
        <p className="text-[10px] text-zinc-500 truncate w-full mt-0.5">
          {driver.team_name}
        </p>
      </div>
    </article>
  );
}

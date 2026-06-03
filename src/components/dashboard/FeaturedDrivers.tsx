import { Link } from "react-router-dom";
import type { Driver } from "../../types/driver";

type FeaturedDriversProps = {
  drivers: Driver[];
  loading?: boolean;
};

const RANK_STYLES: Record<
  number,
  { badge: string; ring: string; podiumOffset: string }
> = {
  1: {
    badge: "bg-amber-400/20 text-amber-300 border-amber-400/40",
    ring: "ring-2 ring-amber-400/50 shadow-lg shadow-amber-900/20",
    podiumOffset: "",
  },
  2: {
    badge: "bg-zinc-400/15 text-zinc-200 border-zinc-400/30",
    ring: "ring-1 ring-zinc-500/25",
    podiumOffset: "mt-4 sm:mt-6",
  },
  3: {
    badge: "bg-amber-800/25 text-amber-600 border-amber-800/40",
    ring: "ring-1 ring-amber-800/30",
    podiumOffset: "mt-6 sm:mt-8",
  },
};

function rankStyle(position: number) {
  return (
    RANK_STYLES[position] ?? {
      badge: "bg-zinc-800 text-zinc-400 border-zinc-700",
      ring: "",
      podiumOffset: "mt-2",
    }
  );
}

export function FeaturedDrivers({ drivers, loading }: FeaturedDriversProps) {
  const leaderPoints = drivers[0]?.total_points ?? 0;
  const podium = drivers.slice(0, 3);
  const rest = drivers.slice(3, 5);

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
        <div>
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
            Driver standings
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">Championship top 5</p>
        </div>
        <Link
          to="/drivers"
          className="text-sm text-[#e10600] hover:text-red-400 transition-colors"
        >
          Full standings →
        </Link>
      </div>

      {loading ? (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3 items-end max-w-xl mx-auto">
            {[1, 0, 2].map((i) => (
              <div
                key={i}
                className={`rounded-xl bg-zinc-800/50 animate-pulse ${
                  i === 0 ? "h-44" : "h-36"
                }`}
              />
            ))}
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
            <div className="h-32 rounded-xl bg-zinc-800/50 animate-pulse" />
            <div className="h-32 rounded-xl bg-zinc-800/50 animate-pulse" />
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {podium.length > 0 && (
            <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end max-w-xl mx-auto w-full">
              {[podium[1], podium[0], podium[2]]
                .filter(Boolean)
                .map((driver) => {
                  const position =
                    drivers.findIndex(
                      (d) => d.driver_number === driver!.driver_number,
                    ) + 1;
                  const gap =
                    position === 1 ? null : leaderPoints - driver!.total_points;
                  return (
                    <FeaturedDriverCard
                      key={driver!.driver_number}
                      driver={driver!}
                      position={position}
                      gapToLeader={gap}
                    />
                  );
                })}
            </div>
          )}

          {rest.length > 0 && (
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto w-full">
              {rest.map((driver) => {
                const position =
                  drivers.findIndex(
                    (d) => d.driver_number === driver.driver_number,
                  ) + 1;
                const gap = leaderPoints - driver.total_points;
                return (
                  <FeaturedDriverCard
                    key={driver.driver_number}
                    driver={driver}
                    position={position}
                    gapToLeader={gap}
                  />
                );
              })}
            </div>
          )}
        </div>
      )}
    </section>
  );
}

type FeaturedDriverCardProps = {
  driver: Driver;
  position: number;
  gapToLeader: number | null;
};

function FeaturedDriverCard({
  driver,
  position,
  gapToLeader,
}: FeaturedDriverCardProps) {
  const isLeader = position === 1;
  const styles = rankStyle(position);

  return (
    <Link
      to={`/drivers/${driver.driver_number}`}
      className={`relative rounded-xl border border-zinc-800 bg-[#1c1c27] overflow-hidden flex flex-col w-full hover:border-zinc-600 hover:bg-zinc-900/40 transition-colors ${styles.ring} ${styles.podiumOffset}`}
    >
      <div
        className="absolute top-2 left-2 z-10"
        aria-label={`Position ${position}`}
      >
        <span
          className={`inline-flex items-center justify-center min-w-[1.75rem] h-7 px-1.5 rounded-md border text-xs font-bold font-mono tabular-nums ${styles.badge}`}
        >
          {position}
        </span>
      </div>

      {isLeader && (
        <p className="absolute top-2 right-2 z-10 text-[9px] uppercase tracking-wider font-semibold text-amber-300/90">
          Leader
        </p>
      )}

      <div
        className="h-1 shrink-0"
        style={{ backgroundColor: driver.team_colour }}
      />

      <div
        className={`px-3 flex flex-col items-center text-center flex-1 ${
          isLeader ? "pt-3 pb-4" : "py-3 pt-3"
        }`}
      >
        <img
          src={driver.headshot_url}
          alt=""
          className={`rounded-full object-cover bg-zinc-800 mt-5 ${
            isLeader ? "w-[4.5rem] h-[4.5rem] sm:w-20 sm:h-20" : "w-14 h-14"
          }`}
          onError={(e) => {
            (e.target as HTMLImageElement).style.visibility = "hidden";
          }}
        />

        <p
          className={`font-bold tabular-nums mt-2 leading-none ${
            isLeader ? "text-2xl text-amber-300" : "text-lg text-zinc-100"
          }`}
        >
          {driver.total_points}
          <span className="text-[10px] font-normal text-zinc-500 ml-0.5">
            pts
          </span>
        </p>

        {gapToLeader != null && gapToLeader > 0 && (
          <p className="text-[10px] text-zinc-500 tabular-nums mt-1">
            −{gapToLeader}
          </p>
        )}

        <p className="text-[10px] font-mono text-zinc-600 mt-1">
          #{driver.driver_number}
        </p>
        <p
          className={`font-semibold text-zinc-100 truncate w-full ${
            isLeader ? "text-sm sm:text-base" : "text-xs sm:text-sm"
          }`}
        >
          {driver.broadcast_name}
        </p>
        <p className="text-[10px] text-zinc-500 truncate w-full mt-0.5">
          {driver.team_name}
        </p>
      </div>
    </Link>
  );
}

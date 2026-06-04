import { Link } from "react-router-dom";
import type { Driver } from "../../types/driver";
import { countryFlagUrl } from "../../lib/countryFlagUrl";

type FeaturedDriversProps = {
  drivers: Driver[];
  loading?: boolean;
};

const RANK_SUFFIX: Record<number, string> = {
  1: "ST",
  2: "ND",
  3: "RD",
};

export function FeaturedDrivers({ drivers, loading }: FeaturedDriversProps) {
  const podium = drivers.slice(0, 3);
  const slots: ({ driver: Driver; position: number } | null)[] = [
    podium[1] ? { driver: podium[1], position: 2 } : null,
    podium[0] ? { driver: podium[0], position: 1 } : null,
    podium[2] ? { driver: podium[2], position: 3 } : null,
  ];

  return (
    <section>
      <div className="flex flex-wrap items-end justify-between gap-2 mb-4">
        <div>
          <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide">
            Driver standings
          </h2>
          <p className="text-xs text-zinc-600 mt-0.5">Championship top 3</p>
        </div>
        <Link
          to="/drivers"
          className="text-sm text-[#e10600] hover:text-red-400 transition-colors"
        >
          Full standings →
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end max-w-4xl mx-auto">
          <div className="h-[10.5rem] sm:h-[11.5rem] rounded-xl bg-zinc-800/50 animate-pulse" />
          <div className="h-[12.5rem] sm:h-[14rem] rounded-xl bg-zinc-800/50 animate-pulse" />
          <div className="h-36 sm:h-40 rounded-xl bg-zinc-800/50 animate-pulse" />
        </div>
      ) : podium.length === 0 ? (
        <p className="text-zinc-500 text-sm">No driver standings yet.</p>
      ) : (
        <div className="grid grid-cols-3 gap-2 sm:gap-3 items-end max-w-4xl mx-auto w-full">
          {slots.map((slot, index) =>
            slot ? (
              <PodiumStandingsCard
                key={slot.driver.driver_number}
                driver={slot.driver}
                position={slot.position}
              />
            ) : (
              <div key={`empty-${index}`} className="min-h-0" aria-hidden />
            ),
          )}
        </div>
      )}
    </section>
  );
}

type PodiumStandingsCardProps = {
  driver: Driver;
  position: number;
};

const PODIUM_HEIGHT: Record<number, string> = {
  1: "min-h-[12rem] sm:min-h-[14rem]",
  2: "min-h-[10rem] sm:min-h-[12rem]",
  3: "min-h-[8rem] sm:min-h-[10rem]",
};

function PodiumStandingsCard({ driver, position }: PodiumStandingsCardProps) {
  const isFirst = position === 1;
  const suffix = RANK_SUFFIX[position] ?? "TH";
  const teamColour = driver.team_colour || "#71717a";
  const heightClass = PODIUM_HEIGHT[position] ?? PODIUM_HEIGHT[3];

  const positionRankClass =
    position === 1
      ? "text-amber-300"
      : position === 2
        ? "text-zinc-200"
        : "text-amber-600/90";

  return (
    <Link
      to={`/drivers/${driver.driver_number}`}
      className={`group relative block overflow-hidden rounded-xl border border-zinc-800 bg-[#1c1c27] hover:border-zinc-600 hover:bg-zinc-900/50 transition-colors min-w-0 ${heightClass} ${
        isFirst ? "ring-1 ring-amber-400/30" : ""
      }`}
    >
      <div
        className="h-1 shrink-0"
        style={{ backgroundColor: teamColour }}
        aria-hidden
      />

      <div className="relative flex h-full min-h-[inherit] flex-col justify-between p-3 sm:p-3.5 pr-20 sm:pr-24">
        <div>
          <div className="flex items-start leading-none">
            <span
              className={`text-2xl sm:text-3xl font-black tabular-nums ${positionRankClass}`}
            >
              {position}
            </span>
            <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 mt-0.5 ml-0.5">
              {suffix}
            </span>
          </div>

          <p
            className={`font-bold text-zinc-100 leading-tight mt-2 line-clamp-2 ${
              isFirst ? "text-sm sm:text-base" : "text-xs sm:text-sm"
            }`}
          >
            {driver.full_name}
          </p>
          <p
            className={`text-zinc-500 mt-0.5 truncate ${
              isFirst ? "text-xs sm:text-sm" : "text-[11px] sm:text-xs"
            }`}
          >
            {driver.team_name}
          </p>

          <img
            src={countryFlagUrl(driver.country_code)}
            alt=""
            className="mt-2 w-6 h-6 sm:w-7 sm:h-7 rounded-full object-cover ring-1 ring-zinc-700 bg-zinc-800"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        </div>

        <p
          className={`font-black tabular-nums mt-2 text-[#e10600] ${
            isFirst ? "text-xl sm:text-2xl" : "text-lg sm:text-xl"
          }`}
        >
          {driver.total_points}{" "}
          <span className="text-[10px] sm:text-xs font-bold text-zinc-500">
            PTS
          </span>
        </p>
      </div>

      <div
        className={`pointer-events-none absolute right-2 sm:right-3 bottom-2 sm:bottom-3 rounded-full ring-2 bg-zinc-800 overflow-hidden shrink-0 ${
          isFirst
            ? "w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem]"
            : "w-14 h-14 sm:w-16 sm:h-16"
        }`}
        style={{ boxShadow: `0 0 0 1px ${teamColour}55` }}
      >
        <img
          src={driver.headshot_url}
          alt=""
          className="w-full h-full object-cover object-top"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>
    </Link>
  );
}

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

/** Podium step heights — desktop only (sm+). */
const PODIUM_HEIGHT_DESKTOP: Record<number, string> = {
  1: "sm:min-h-[14rem]",
  2: "sm:min-h-[11.5rem]",
  3: "sm:min-h-[10rem]",
};

type CardLayout = "mobileLeader" | "mobileSecondary" | "desktop";

export function FeaturedDrivers({ drivers, loading }: FeaturedDriversProps) {
  const podium = drivers.slice(0, 3);

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
        <>
          <div className="sm:hidden space-y-2 max-w-lg mx-auto">
            <div className="h-28 rounded-xl bg-zinc-800/50 animate-pulse" />
            <div className="grid grid-cols-2 gap-2">
              <div className="h-24 rounded-xl bg-zinc-800/50 animate-pulse" />
              <div className="h-24 rounded-xl bg-zinc-800/50 animate-pulse" />
            </div>
          </div>
          <div className="hidden sm:grid sm:grid-cols-3 sm:gap-3 sm:items-end max-w-4xl mx-auto">
            <div className="h-[11.5rem] rounded-xl bg-zinc-800/50 animate-pulse" />
            <div className="h-[14rem] rounded-xl bg-zinc-800/50 animate-pulse" />
            <div className="h-[10rem] rounded-xl bg-zinc-800/50 animate-pulse" />
          </div>
        </>
      ) : podium.length === 0 ? (
        <p className="text-zinc-500 text-sm">No driver standings yet.</p>
      ) : (
        <>
          {/* Mobile: leader full width, then P2 + P3 */}
          <div className="sm:hidden space-y-2 max-w-lg mx-auto w-full">
            {podium[0] && (
              <PodiumStandingsCard
                driver={podium[0]}
                position={1}
                layout="mobileLeader"
              />
            )}
            {(podium[1] || podium[2]) && (
              <div className="grid grid-cols-2 gap-2">
                {podium[1] && (
                  <PodiumStandingsCard
                    driver={podium[1]}
                    position={2}
                    layout="mobileSecondary"
                  />
                )}
                {podium[2] && (
                  <PodiumStandingsCard
                    driver={podium[2]}
                    position={3}
                    layout="mobileSecondary"
                  />
                )}
              </div>
            )}
          </div>

          {/* Desktop: 2 | 1 | 3 podium */}
          <div className="hidden sm:grid sm:grid-cols-3 sm:gap-3 sm:items-end max-w-4xl mx-auto w-full">
            {podium[1] && (
              <PodiumStandingsCard
                driver={podium[1]}
                position={2}
                layout="desktop"
              />
            )}
            {!podium[1] && <div aria-hidden />}
            {podium[0] && (
              <PodiumStandingsCard
                driver={podium[0]}
                position={1}
                layout="desktop"
              />
            )}
            {!podium[0] && <div aria-hidden />}
            {podium[2] ? (
              <PodiumStandingsCard
                driver={podium[2]}
                position={3}
                layout="desktop"
              />
            ) : (
              <div aria-hidden />
            )}
          </div>
        </>
      )}
    </section>
  );
}

type PodiumStandingsCardProps = {
  driver: Driver;
  position: number;
  layout: CardLayout;
};

function PodiumStandingsCard({
  driver,
  position,
  layout,
}: PodiumStandingsCardProps) {
  const isFirst = position === 1;
  const isDesktop = layout === "desktop";
  const isMobileLeader = layout === "mobileLeader";
  const suffix = RANK_SUFFIX[position] ?? "TH";
  const teamColour = driver.team_colour || "#71717a";
  const heightClass = isDesktop ? (PODIUM_HEIGHT_DESKTOP[position] ?? PODIUM_HEIGHT_DESKTOP[3]) : "";

  const positionRankClass =
    position === 1
      ? "text-amber-300"
      : position === 2
        ? "text-zinc-200"
        : "text-amber-600/90";

  const headshotSize = isMobileLeader
    ? "w-20 h-20"
    : isDesktop
      ? isFirst
        ? "w-16 h-16 sm:w-[4.5rem] sm:h-[4.5rem]"
        : "w-14 h-14 sm:w-16 sm:h-16"
      : "w-14 h-14";

  return (
    <Link
      to={`/drivers/${driver.driver_number}`}
      className={`group relative block overflow-hidden rounded-xl border border-zinc-800 bg-[#1c1c27] hover:border-zinc-600 hover:bg-zinc-900/50 transition-colors min-w-0 w-full ${heightClass} ${
        isFirst ? "ring-1 ring-amber-400/30" : ""
      } ${isDesktop ? "min-h-0" : ""}`}
    >
      <div
        className="h-1 shrink-0"
        style={{ backgroundColor: teamColour }}
        aria-hidden
      />

      <div
        className={`relative flex min-h-0 ${
          isMobileLeader
            ? "flex-row items-stretch gap-3 p-3 pr-3"
            : `flex-col justify-between p-3 sm:p-3.5 ${
                isDesktop ? "pr-20 sm:pr-24" : "pr-[4.25rem]"
              }`
        }`}
      >
        <div className={isMobileLeader ? "flex-1 min-w-0 flex flex-col justify-between" : ""}>
          <div>
            <div className="flex items-start leading-none">
              <span
                className={`font-black tabular-nums ${positionRankClass} ${
                  isMobileLeader
                    ? "text-3xl"
                    : isDesktop
                      ? "text-2xl sm:text-3xl"
                      : "text-xl"
                }`}
              >
                {position}
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold text-zinc-500 mt-0.5 ml-0.5">
                {suffix}
              </span>
            </div>

            <p
              className={`font-bold text-zinc-100 leading-snug mt-2 ${
                isMobileLeader
                  ? "text-base"
                  : isDesktop
                    ? isFirst
                      ? "text-sm sm:text-base line-clamp-2"
                      : "text-xs sm:text-sm line-clamp-2"
                    : "text-xs line-clamp-2"
              }`}
            >
              {driver.full_name}
            </p>
            <p
              className={`text-zinc-500 mt-0.5 line-clamp-1 ${
                isMobileLeader ? "text-sm" : "text-[11px] sm:text-xs"
              }`}
            >
              {driver.team_name}
            </p>

            <img
              src={countryFlagUrl(driver.country_code)}
              alt=""
              className={`mt-2 rounded-full object-cover ring-1 ring-zinc-700 bg-zinc-800 ${
                isMobileLeader ? "w-7 h-7" : "w-6 h-6 sm:w-7 sm:h-7"
              }`}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          <p
            className={`font-black tabular-nums mt-2 text-[#e10600] ${
              isMobileLeader
                ? "text-2xl"
                : isDesktop
                  ? isFirst
                    ? "text-xl sm:text-2xl"
                    : "text-lg sm:text-xl"
                  : "text-lg"
            }`}
          >
            {driver.total_points}{" "}
            <span className="text-[10px] sm:text-xs font-bold text-zinc-500">
              PTS
            </span>
          </p>
        </div>

        <div
          className={`pointer-events-none shrink-0 rounded-full ring-2 bg-zinc-800 overflow-hidden ${
            isMobileLeader
              ? "self-center"
              : `absolute right-2 sm:right-3 bottom-2 sm:bottom-3 ${headshotSize}`
          } ${isMobileLeader ? headshotSize : ""}`}
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
      </div>
    </Link>
  );
}

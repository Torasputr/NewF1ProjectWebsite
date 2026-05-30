import type { Driver } from "../../types/driver";

type DriverCardProps = {
  driver: Driver;
};

export function DriverCard({ driver }: DriverCardProps) {
  return (
    <article className="rounded-xl border border-zinc-800 bg-[#1c1c27] overflow-hidden">
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
        <div className="min-w-0">
          <p className="text-xs text-zinc-500 font-mono">
            #{driver.driver_number}
          </p>
          <h3 className="font-semibold text-zinc-100 truncate">
            {driver.full_name}
          </h3>
          <p className="text-sm text-zinc-400">{driver.name_acronym}</p>
          <p className="text-xs text-zinc-500 mt-0.5">{driver.country_code}</p>
        </div>
      </div>
    </article>
  );
}

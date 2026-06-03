import { Link } from "react-router-dom";
import type { PodiumEntry } from "../../lib/sessionResultUtils";
import { formatPodiumRaceTime } from "../../lib/sessionResultUtils";

const ORDINAL: Record<number, string> = {
  1: "ST",
  2: "ND",
  3: "RD",
};

type WeekendPodiumProps = {
  podium: PodiumEntry[];
};

function PodiumCard({ entry }: { entry: PodiumEntry }) {
  const suffix = ORDINAL[entry.position] ?? "TH";
  const time = formatPodiumRaceTime(entry);

  return (
    <Link
      to={`/drivers/${entry.driver_number}`}
      title={entry.full_name}
      className="flex items-center gap-2 min-w-0 rounded-lg bg-zinc-800/90 border border-zinc-700/80 px-2 py-2.5 hover:border-zinc-600 hover:bg-zinc-800 transition-colors"
    >
      <div className="flex items-start shrink-0 leading-none">
        <span className="text-2xl sm:text-3xl font-black text-white tabular-nums">
          {entry.position}
        </span>
        <span className="text-[9px] sm:text-[10px] font-bold text-zinc-400 mt-0.5">
          {suffix}
        </span>
      </div>

      <div
        className="shrink-0 w-11 h-11 sm:w-12 sm:h-12 rounded-full p-0.5"
        style={{ backgroundColor: entry.team_colour }}
      >
        <img
          src={entry.headshot_url}
          alt=""
          className="w-full h-full rounded-full object-cover bg-zinc-900"
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = "none";
          }}
        />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-base sm:text-lg font-black tracking-wide text-white truncate">
          {entry.name_acronym}
        </p>
        <p className="text-[11px] sm:text-xs font-mono text-zinc-300 tabular-nums truncate mt-0.5">
          {time}
        </p>
      </div>
    </Link>
  );
}

export function WeekendPodium({ podium }: WeekendPodiumProps) {
  if (podium.length === 0) return null;

  const ordered = [...podium].sort((a, b) => a.position - b.position);

  return (
    <div className="px-3 py-3 border-b border-zinc-800/80 bg-zinc-900/50">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
        {ordered.map((entry) => (
          <PodiumCard key={entry.driver_number} entry={entry} />
        ))}
      </div>
    </div>
  );
}

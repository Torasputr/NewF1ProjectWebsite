import { Link } from "react-router-dom";
import type {
  HeroPodiumGroup,
  HeroSessionPodiums,
  PodiumEntry,
} from "../../lib/sessionResultUtils";
import { formatPodiumRaceTime } from "../../lib/sessionResultUtils";

type HeroLastSessionProps = {
  podiums: HeroSessionPodiums;
};

const ORDINAL: Record<number, string> = {
  1: "ST",
  2: "ND",
  3: "RD",
};

/** Vertical tile — fills a grid column in practice panels. */
function HeroPodiumTile({ entry }: { entry: PodiumEntry }) {
  const time = formatPodiumRaceTime(entry);
  const suffix = ORDINAL[entry.position] ?? "TH";

  return (
    <Link
      to={`/drivers/${entry.driver_number}`}
      title={entry.full_name}
      className="flex flex-col items-center gap-1.5 min-w-0 rounded-lg bg-zinc-800/50 border border-zinc-700/50 px-2 py-3 hover:border-zinc-600 hover:bg-zinc-800/80 transition-colors"
    >
      <div className="flex items-start leading-none">
        <span className="text-2xl font-black text-white tabular-nums">
          {entry.position}
        </span>
        <span className="text-[9px] font-bold text-zinc-500 mt-0.5">{suffix}</span>
      </div>
      <div
        className="w-11 h-11 rounded-full p-0.5 shrink-0"
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
      <p className="text-sm font-black text-white truncate w-full text-center">
        {entry.name_acronym}
      </p>
      <p className="text-[10px] font-mono text-zinc-400 tabular-nums truncate w-full text-center">
        {time}
      </p>
    </Link>
  );
}

/** Horizontal card for quali / race — stretches in a 3-col row. */
function HeroPodiumCard({ entry }: { entry: PodiumEntry }) {
  const time = formatPodiumRaceTime(entry);
  const suffix = ORDINAL[entry.position] ?? "TH";

  return (
    <Link
      to={`/drivers/${entry.driver_number}`}
      title={entry.full_name}
      className="flex items-center gap-3 min-w-0 flex-1 rounded-xl bg-zinc-900/50 border border-zinc-800/60 px-4 py-3 hover:border-zinc-700 hover:bg-zinc-900/70 transition-colors"
    >
      <div className="flex items-start shrink-0 leading-none">
        <span className="text-3xl font-black text-white tabular-nums">
          {entry.position}
        </span>
        <span className="text-[10px] font-bold text-zinc-500 mt-1">{suffix}</span>
      </div>
      <div
        className="shrink-0 w-12 h-12 rounded-full p-0.5"
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
        <p className="text-lg font-black text-white truncate">
          {entry.name_acronym}
        </p>
        <p className="text-xs font-mono text-zinc-400 tabular-nums truncate">
          {time}
        </p>
      </div>
    </Link>
  );
}

function PracticeFpPanel({ group }: { group: HeroPodiumGroup }) {
  const ordered = [...group.podium].sort((a, b) => a.position - b.position);

  return (
    <div className="flex-1 min-w-[min(100%,14rem)] rounded-xl border border-zinc-800/60 bg-zinc-900/40 p-3 sm:p-4">
      <p className="text-sm font-semibold text-zinc-400 text-center mb-3">
        {group.sessionLabel}
      </p>
      <div className="grid grid-cols-3 gap-2 sm:gap-3">
        {ordered.map((entry) => (
          <HeroPodiumTile key={entry.driver_number} entry={entry} />
        ))}
      </div>
    </div>
  );
}

function QualiRaceRow({ group }: { group: HeroPodiumGroup }) {
  const ordered = [...group.podium].sort((a, b) => a.position - b.position);

  return (
    <div className="flex flex-col sm:flex-row gap-3 w-full">
      {ordered.map((entry) => (
        <HeroPodiumCard key={entry.driver_number} entry={entry} />
      ))}
    </div>
  );
}

const MODE_HEADING: Record<HeroSessionPodiums["mode"], string> = {
  practice: "Practice podiums",
  qualifying: "Qualifying podium",
  race: "Race result",
};

export function HeroLastSession({ podiums }: HeroLastSessionProps) {
  const isPractice = podiums.mode === "practice";
  const sessionTitle =
    !isPractice && podiums.groups[0]
      ? podiums.groups[0].sessionName
      : null;

  return (
    <div className="w-full">
      <div className="flex flex-col items-center text-center gap-1 mb-4">
        <p className="text-xs font-medium uppercase tracking-wider text-zinc-500">
          {MODE_HEADING[podiums.mode]}
        </p>
        {sessionTitle && (
          <p className="text-sm text-zinc-300 font-medium">{sessionTitle}</p>
        )}
      </div>

      {isPractice ? (
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full">
          {podiums.groups.map((group) => (
            <PracticeFpPanel key={group.sessionLabel} group={group} />
          ))}
        </div>
      ) : (
        podiums.groups.map((group) => (
          <QualiRaceRow key={group.sessionLabel} group={group} />
        ))
      )}
    </div>
  );
}

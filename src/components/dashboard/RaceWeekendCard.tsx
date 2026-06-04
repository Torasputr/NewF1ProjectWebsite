import { useNavigate } from "react-router-dom";
import type { RaceWeekend } from "../../types/schedule";
import { formatWeekendRange } from "../../lib/dateTimeFormat";
import type { WeekendStatus } from "../../lib/scheduleUtils";
import {
  isTestingWeekend,
  weekendHasClickableResults,
} from "../../lib/scheduleUtils";
import type { PodiumEntry } from "../../lib/sessionResultUtils";
import { SessionRow } from "../ui/SessionRow";
import { WeekendPodium } from "./WeekendPodium";

const STATUS_STYLES: Record<
  WeekendStatus,
  { article: string; badge: string; badgeLabel: string }
> = {
  completed: {
    article: "border-zinc-800 bg-[#1c1c27]",
    badge: "bg-zinc-700/80 text-zinc-400",
    badgeLabel: "Completed",
  },
  upcoming: {
    article: "border-zinc-800 bg-[#1c1c27]",
    badge: "bg-zinc-800 text-zinc-400",
    badgeLabel: "Upcoming",
  },
  in_progress: {
    article: "border-[#e10600]/50 bg-[#1c1c27] ring-1 ring-[#e10600]/25",
    badge: "bg-[#e10600]/20 text-[#e10600]",
    badgeLabel: "This weekend",
  },
  cancelled: {
    article: "border-red-900/50 bg-zinc-900/50 opacity-60",
    badge: "bg-red-950 text-red-400",
    badgeLabel: "Cancelled",
  },
};

type RaceWeekendCardProps = {
  weekend: RaceWeekend;
  status: WeekendStatus;
  isFocus?: boolean;
  podium?: PodiumEntry[];
};

export function RaceWeekendCard({
  weekend,
  status,
  isFocus = false,
  podium,
}: RaceWeekendCardProps) {
  const navigate = useNavigate();
  const isTesting = isTestingWeekend(weekend);
  const styles = STATUS_STYLES[status];
  const isCompleted = status === "completed";
  const showPodium = isCompleted && podium && podium.length > 0;
  const cardClickable = weekendHasClickableResults(weekend);

  const badgeLabel =
    isFocus && (status === "upcoming" || status === "in_progress")
      ? status === "in_progress"
        ? "Live now"
        : "Next race"
      : styles.badgeLabel;

  const focusRing = isFocus && !isCompleted ? "ring-2 ring-[#e10600]/40" : "";

  const goToWeekend = () => {
    if (cardClickable) {
      navigate(`/race/${weekend.meeting_key}`);
    }
  };

  return (
    <article
      role={cardClickable ? "link" : undefined}
      tabIndex={cardClickable ? 0 : undefined}
      onClick={cardClickable ? goToWeekend : undefined}
      onKeyDown={
        cardClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                goToWeekend();
              }
            }
          : undefined
      }
      className={`rounded-xl border overflow-hidden transition-[opacity,box-shadow,border-color,background-color] ${styles.article} ${focusRing} ${
        cardClickable
          ? "group cursor-pointer hover:border-zinc-600 hover:bg-zinc-900/40"
          : ""
      }`}
    >
      <div className="p-4 border-b border-zinc-800/80">
        <div className="flex items-start gap-2 flex-wrap">
          <img
            src={weekend.country_flag}
            alt=""
            className="w-6 h-4 object-cover rounded-sm shrink-0"
          />
          <h3
            className={`font-semibold flex-1 min-w-0 ${
              isCompleted ? "text-zinc-300" : "text-zinc-100"
            }`}
          >
            {weekend.meeting_name}
          </h3>
          {isTesting && (
            <span className="text-xs px-2 py-0.5 rounded bg-zinc-700 text-zinc-300">
              Testing
            </span>
          )}
          <span
            className={`text-[10px] uppercase tracking-wide px-2 py-0.5 rounded shrink-0 ${styles.badge}`}
          >
            {badgeLabel}
          </span>
        </div>
        <p
          className={`text-sm mt-1 ${
            isCompleted ? "text-zinc-500" : "text-zinc-400"
          }`}
        >
          {weekend.circuit_short_name} · {weekend.location}
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          {formatWeekendRange(weekend.weekendStart, weekend.weekendEnd)}
        </p>
        {cardClickable && (
          <p className="text-[10px] text-zinc-600 mt-2 transition-colors group-hover:text-[#e10600]">
            View weekend →
          </p>
        )}
      </div>

      {showPodium && (
        <div onClick={(e) => e.stopPropagation()} onKeyDown={(e) => e.stopPropagation()}>
          <WeekendPodium podium={podium} />
        </div>
      )}

      <div className="px-4 py-2 pointer-events-none">
        {weekend.sessions.map((s) => (
          <SessionRow key={s.session_key} session={s} linkable={false} />
        ))}
      </div>
    </article>
  );
}

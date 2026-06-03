import type { RaceWeekend } from "../../types/schedule";
import type { PodiumEntry } from "../../lib/sessionResultUtils";
import { getWeekendStatus, isTestingWeekend } from "../../lib/scheduleUtils";
import { RaceWeekendCard } from "./RaceWeekendCard";

type RaceWeekendListProps = {
  weekends: RaceWeekend[];
  focusMeetingKey?: number;
  podiumByMeeting?: Map<number, PodiumEntry[]>;
};

export function RaceWeekendList({
  weekends,
  focusMeetingKey,
  podiumByMeeting,
}: RaceWeekendListProps) {
  const display = weekends.filter((w) => !isTestingWeekend(w));

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {display.map((w) => (
        <RaceWeekendCard
          key={w.meeting_key}
          weekend={w}
          status={getWeekendStatus(w)}
          isFocus={focusMeetingKey != null && w.meeting_key === focusMeetingKey}
          podium={podiumByMeeting?.get(w.meeting_key)}
        />
      ))}
    </div>
  );
}

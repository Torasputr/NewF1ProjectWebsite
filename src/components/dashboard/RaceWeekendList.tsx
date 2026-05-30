import type { RaceWeekend } from "../../types/schedule";
import { RaceWeekendCard } from "./RaceWeekendCard";

type RaceWeekendListProps = { weekends: RaceWeekend[] };

export function RaceWeekendList({ weekends }: RaceWeekendListProps) {
  const display = weekends.filter(
    (w) => !w.meeting_name.toLowerCase().includes("testing"),
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {display.map((w) => (
        <RaceWeekendCard key={w.meeting_key} weekend={w} />
      ))}
    </div>
  );
}

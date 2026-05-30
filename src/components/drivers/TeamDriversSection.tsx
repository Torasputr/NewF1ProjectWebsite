import type { Driver } from "../../types/driver";
import { DriverCard } from "./DriverCard";

type TeamDriversSectionProps = {
  teamName: string;
  drivers: Driver[];
  teamColour?: string;
};

export function TeamDriversSection({
  teamName,
  drivers,
  teamColour,
}: TeamDriversSectionProps) {
  return (
    <section>
      <h2
        className="text-lg font-semibold mb-3 text-zinc-200 pl-3"
        style={{ borderLeft: `4px solid ${teamColour ?? "#71717a"}` }}
      >
        {teamName}
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {drivers.map((d) => (
          <DriverCard key={d.driver_number} driver={d} />
        ))}
      </div>
    </section>
  );
}

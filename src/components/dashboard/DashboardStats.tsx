import type { DashboardStats as Stats } from "../../lib/scheduleUtils";

type DashboardStatsProps = Stats;

export function DashboardStats({
  drivers,
  rounds,
  roundsLeft,
  cancelledMeetings,
}: DashboardStatsProps) {
  return (
    <section>
      <h2 className="text-sm font-medium text-zinc-400 uppercase tracking-wide mb-3">
        Season overview
      </h2>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatChip label="Drivers" value={String(drivers)} />
        <StatChip label="Rounds" value={String(rounds)} />
        <StatChip label="Rounds left" value={String(roundsLeft)} />
        <StatChip
          label="Cancelled meetings"
          value={String(cancelledMeetings)}
        />
      </div>
    </section>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-[#1c1c27] px-4 py-3">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-2xl font-semibold text-zinc-100 mt-1">{value}</p>
    </div>
  );
}

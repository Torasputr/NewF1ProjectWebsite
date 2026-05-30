type SeasonStatsProps = {
  rounds: number;
  nextRound: number;
  cancelled: number;
};

export function SeasonStats({
  rounds,
  nextRound,
  cancelled,
}: SeasonStatsProps) {
  return (
    <div className="flex flex-wrap gap-3">
      <StatChip label="Rounds" value={String(rounds)} />
      <StatChip label="Next round" value={String(nextRound)} />
      <StatChip label="Cancelled sessions" value={String(cancelled)} />
    </div>
  );
}

function StatChip({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-800 bg-[#1c1c27] px-4 py-2">
      <p className="text-xs text-zinc-500">{label}</p>
      <p className="text-lg font-semibold text-zinc-100">{value}</p>
    </div>
  );
}

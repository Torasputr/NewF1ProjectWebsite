import { useEffect, useState } from "react";
import { formatCountdown } from "../../lib/countdown";

const LABELS_4 = ["days", "hrs", "min", "sec"] as const;
const LABELS_3 = ["hrs", "min", "sec"] as const;

type CountdownDisplayProps = {
  target: Date;
  label?: string;
};

export function CountdownDisplay({
  target,
  label = "Starts in",
}: CountdownDisplayProps) {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const countdown = formatCountdown(target, now);
  const parts = countdown.split(":");
  const labels = parts.length === 4 ? LABELS_4 : LABELS_3;

  return (
    <div>
      <p className="text-xs text-zinc-500 uppercase tracking-wide mb-2">
        {label}
      </p>
      <div
        className="flex flex-wrap items-center gap-1 sm:gap-2"
        role="timer"
        aria-label={`${label} ${parts.join(", ")}`}
      >
        {parts.map((part, i) => (
          <span key={i} className="flex items-center gap-1 sm:gap-2">
            {i > 0 && (
              <span
                className="text-zinc-500 font-mono text-2xl sm:text-3xl font-bold leading-none select-none pb-1"
                aria-hidden
              >
                :
              </span>
            )}
            <span className="flex flex-col items-center gap-1">
              <span className="inline-flex min-w-[2.75rem] justify-center bg-zinc-900/80 border border-zinc-800 px-3 py-2 rounded-lg font-mono text-2xl sm:text-3xl font-bold tabular-nums text-[#e10600]">
                {part}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-zinc-600">
                {labels[i]}
              </span>
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}

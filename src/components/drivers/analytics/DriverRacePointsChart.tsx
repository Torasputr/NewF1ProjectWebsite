import { useMemo, useState } from "react";
import type { DriverRacePointEntry } from "../../../lib/driverAnalyticsUtils";

const CHART_HEIGHT = 100;
const BAR_WIDTH = 22;
const BAR_GAP = 6;
const PADDING = { top: 8, right: 8, bottom: 36, left: 28 };
const MAX_SCALE = 25;

type DriverRacePointsChartProps = {
  series: DriverRacePointEntry[];
  teamColour: string;
};

function barFill(
  entry: DriverRacePointEntry,
  teamColour: string,
): string {
  if (entry.dns || entry.dsq) return "#3f3f46";
  if (entry.dnf) return "#52525b";
  if (entry.position === 1) return "#fbbf24";
  if (entry.points >= 15) return teamColour;
  return `${teamColour}cc`;
}

function axisLabel(entry: DriverRacePointEntry): string {
  const circuit = entry.circuit_short_name;
  if (entry.isSprint) {
    const short =
      circuit.length > 8 ? `${circuit.slice(0, 7)}…` : circuit;
    return `${short}·S`;
  }
  return circuit.length > 10 ? `${circuit.slice(0, 9)}…` : circuit;
}

export function DriverRacePointsChart({
  series,
  teamColour,
}: DriverRacePointsChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const layout = useMemo(() => {
    const plotWidth =
      series.length * BAR_WIDTH +
      Math.max(0, series.length - 1) * BAR_GAP;
    const width = PADDING.left + plotWidth + PADDING.right;
    const height = CHART_HEIGHT + PADDING.top + PADDING.bottom;
    const plotHeight = CHART_HEIGHT;

    const bars = series.map((entry, index) => {
      const x = PADDING.left + index * (BAR_WIDTH + BAR_GAP);
      const ratio = entry.points / MAX_SCALE;
      const barHeight = Math.max(entry.points > 0 ? 3 : 1, ratio * plotHeight);
      const y = PADDING.top + plotHeight - barHeight;
      return { entry, index, x, y, barHeight };
    });

    const yTicks = [0, 10, 25];

    return { width, height, plotHeight, bars, yTicks };
  }, [series]);

  if (series.length === 0) {
    return (
      <p className="text-zinc-500 text-xs rounded-lg border border-zinc-800 bg-[#1c1c27] px-3 py-4">
        No race or sprint results yet.
      </p>
    );
  }

  const active =
    activeIndex != null ? layout.bars[activeIndex]?.entry : null;

  return (
    <div className="space-y-2">
      <div className="overflow-x-auto rounded-lg border border-zinc-800 bg-[#1c1c27] px-2 py-2 max-h-[148px]">
        <svg
          viewBox={`0 0 ${layout.width} ${layout.height}`}
          className="h-[132px] w-auto max-w-none"
          style={{ minWidth: Math.min(layout.width, 320) }}
          role="img"
          aria-label="Bar chart of points scored per race and sprint"
        >
          {layout.yTicks.map((tick) => {
            const y =
              PADDING.top +
              layout.plotHeight -
              (tick / MAX_SCALE) * layout.plotHeight;
            return (
              <g key={tick}>
                <line
                  x1={PADDING.left}
                  y1={y}
                  x2={layout.width - PADDING.right}
                  y2={y}
                  stroke="#27272a"
                  strokeDasharray={tick === 0 ? undefined : "3 3"}
                />
                <text
                  x={PADDING.left - 6}
                  y={y + 3}
                  textAnchor="end"
                  className="fill-zinc-500 text-[8px] font-mono"
                >
                  {tick}
                </text>
              </g>
            );
          })}

          {layout.bars.map(({ entry, index, x, y, barHeight }) => {
            const isActive = activeIndex === index;
            return (
              <g
                key={`${entry.session_key}-${entry.meeting_key}`}
                onMouseEnter={() => setActiveIndex(index)}
                onMouseLeave={() => setActiveIndex(null)}
                onFocus={() => setActiveIndex(index)}
                onBlur={() => setActiveIndex(null)}
                tabIndex={0}
                className="cursor-pointer outline-none"
              >
                <rect
                  x={x}
                  y={PADDING.top}
                  width={BAR_WIDTH}
                  height={layout.plotHeight}
                  fill="transparent"
                />
                <rect
                  x={x + 1}
                  y={y}
                  width={BAR_WIDTH - 2}
                  height={barHeight}
                  rx={2}
                  fill={barFill(entry, teamColour)}
                  stroke={entry.isSprint ? "#71717a" : undefined}
                  strokeWidth={entry.isSprint ? 1 : 0}
                  strokeDasharray={entry.isSprint ? "2 2" : undefined}
                  opacity={isActive ? 1 : 0.85}
                  className="transition-opacity"
                />
                {entry.points > 0 && (
                  <text
                    x={x + BAR_WIDTH / 2}
                    y={y - 3}
                    textAnchor="middle"
                    className="fill-zinc-400 text-[7px] font-mono"
                  >
                    {entry.points}
                  </text>
                )}
                <text
                  x={x + BAR_WIDTH / 2}
                  y={layout.height - PADDING.bottom + 10}
                  textAnchor="end"
                  transform={`rotate(-45, ${x + BAR_WIDTH / 2}, ${layout.height - PADDING.bottom + 10})`}
                  className="fill-zinc-500 text-[7px]"
                >
                  {axisLabel(entry)}
                </text>
              </g>
            );
          })}
        </svg>
      </div>

      {active ? (
        <p className="text-xs text-zinc-400 px-1">
          <span className="text-zinc-200 font-medium">
            {active.meeting_name}
          </span>
          {" · "}
          {active.isSprint ? "Sprint" : "Race"}
          {" · "}
          <span className="text-[#e10600] font-semibold tabular-nums">
            {active.points} pts
          </span>
          , P{active.position}
          {(active.dnf || active.dns || active.dsq) && (
            <span className="text-amber-400">
              {" "}
              · {active.dns ? "DNS" : active.dsq ? "DSQ" : "DNF"}
            </span>
          )}
        </p>
      ) : (
        <p className="text-[10px] text-zinc-600 px-1">
          Races and sprints in order · dashed outline = sprint · max 25 pts
        </p>
      )}
    </div>
  );
}

export type ScoringSessionCategory = "race" | "sprint";

/** F1 grand prix points by finishing position (P1–P10). */
export const GRAND_PRIX_POINTS_BY_POSITION = [
  25, 18, 15, 12, 10, 8, 6, 4, 2, 1,
] as const;

/** F1 sprint points by finishing position (P1–P8). */
export const SPRINT_POINTS_BY_POSITION = [8, 7, 6, 5, 4, 3, 2, 1] as const;

import type { ScheduleSession } from "../types/schedule";

/** Max constructor points in one session (both cars P1–P2). */
export function maxConstructorPointsForSession(session: ScheduleSession): number {
  if (session.is_cancelled) return 0;
  if (session.session_type === "Race" && session.session_name === "Race") {
    return (
      GRAND_PRIX_POINTS_BY_POSITION[0] + GRAND_PRIX_POINTS_BY_POSITION[1]
    );
  }
  if (session.session_type === "Race" && session.session_name === "Sprint") {
    return SPRINT_POINTS_BY_POSITION[0] + SPRINT_POINTS_BY_POSITION[1];
  }
  return 0;
}

export function pointsForFinishPosition(
  position: number,
  sessionCategory: ScoringSessionCategory,
): number {
  const table =
    sessionCategory === "sprint"
      ? SPRINT_POINTS_BY_POSITION
      : GRAND_PRIX_POINTS_BY_POSITION;
  if (position < 1 || position > table.length) return 0;
  return table[position - 1] ?? 0;
}

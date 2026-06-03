export interface SessionResultRow {
  meeting_key: number;
  session_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  year: number;
  position: number;
  driver_number: number;
  number_of_laps: number | null;
  dnf: boolean;
  dns: boolean;
  dsq: boolean;
  gap_to_leader?: number | string | null;
  duration?: number | null;
  points?: number | null;
  q1?: number | null;
  q2?: number | null;
  q3?: number | null;
  best_lap_time?: number | null;
}

export interface SessionResultsGroup {
  session_key: number;
  session_name: string;
  session_type: string;
  date_start: string;
  rows: SessionResultRow[];
}

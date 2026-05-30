export interface ScheduleSession {
  meeting_key: number;
  meeting_name: string;
  meeting_official_name: string;
  session_key: number;
  session_type: string;
  session_name: string;
  date_start: string;
  date_end: string;
  country_key: number;
  country_code: string;
  country_name: string;
  country_flag: string;
  location: string;
  gmt_offset: string;
  circuit_key: number;
  circuit_short_name: string;
  circuit_type: string;
  circuit_info_url: string;
  circuit_image: string;
  year: number;
  is_cancelled: boolean;
  ingested_at: string;
}

// src/types/schedule.ts (add)
export interface RaceWeekend {
  meeting_key: number;
  meeting_name: string;
  country_name: string;
  country_flag: string;
  location: string;
  circuit_short_name: string;
  circuit_image: string;
  sessions: ScheduleSession[];
  weekendStart: Date;
  weekendEnd: Date;
}

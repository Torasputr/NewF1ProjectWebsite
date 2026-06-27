import { useMemo } from "react";
import { useDrivers } from "./useDrivers";
import { useDriverStandings } from "./useDriverStandings";
import { mergeRosterWithStandings } from "../lib/driverUtils";

/** Roster profiles from `drivers/` merged with points from `driver_standings/`. */
export function useDriversWithStandings() {
  const {
    data: roster,
    loading: rosterLoading,
    error: rosterError,
  } = useDrivers();
  const {
    data: standings,
    loading: standingsLoading,
    error: standingsError,
  } = useDriverStandings();

  const data = useMemo(() => {
    if (roster && standings) {
      return mergeRosterWithStandings(roster, standings);
    }
    return null;
  }, [roster, standings]);

  return {
    data,
    roster,
    standings,
    loading: rosterLoading || standingsLoading,
    error: standingsError ?? rosterError,
  };
}

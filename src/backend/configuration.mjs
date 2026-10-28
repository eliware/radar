import { parseRadarViewSettings } from "../shared/radar-view-settings.mjs";
import { parseElevation } from "./config/elevation.mjs";
import { parsePort } from "./config/port.mjs";

export function resolveWebConfiguration(environment, { parseAdsbLocation, parseMetarStations }) {
  return {
    port: parsePort(environment.PORT ?? "3000", "PORT"),
    feedPort: parsePort(environment.ADSB_PORT ?? "30003", "ADSB_PORT"),
    location: parseAdsbLocation(environment.ADSB_LAT, environment.ADSB_LON),
    elevationFeet: parseElevation(environment.ADSB_ALT ?? "300"),
    radarViewSettings: parseRadarViewSettings(environment),
    airportDatabasePath: environment.NASR_DATABASE_PATH,
    metarStations: parseMetarStations(environment.METAR_STATIONS),
    logLevel: environment.LOG_LEVEL ?? "info",
    feedHost: environment.ADSB_HOST ?? "127.0.0.1",
  };
}

import { parseRadarViewSettings } from "../../shared/parse-radar-view-settings.mjs";
import { parseElevation } from "./elevation.mjs";
import { parsePort } from "./port.mjs";

export function resolveWebNetworkConfiguration(environment, parseAdsbLocation) {
  return {
    port: parsePort(environment.PORT ?? "3000", "PORT"),
    feedPort: parsePort(environment.ADSB_PORT ?? "30003", "ADSB_PORT"),
    feedHost: environment.ADSB_HOST ?? "127.0.0.1",
    location: parseAdsbLocation(environment.ADSB_LAT, environment.ADSB_LON),
    elevationFeet: parseElevation(environment.ADSB_ALT ?? "300"),
    radarViewSettings: parseRadarViewSettings(environment),
  };
}

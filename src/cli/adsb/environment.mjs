import { config } from "dotenv";

export function loadAdsbEnvironment(load = config) {
  load({ quiet: true });
}

export function readAdsbEnvironment(environment = process.env) {
  return {
    host: environment.ADSB_HOST ?? "127.0.0.1",
    port: environment.ADSB_PORT ?? 30003,
    locationLatitude: environment.ADSB_LAT,
    locationLongitude: environment.ADSB_LON,
  };
}

export function prepareAdsbEnvironment({
  loadEnvironment = loadAdsbEnvironment,
  environment = process.env,
} = {}) {
  loadEnvironment();
  return readAdsbEnvironment(environment);
}

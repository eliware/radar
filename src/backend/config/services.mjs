import { parseAdsbLolPollInterval } from "./adsblol-poll-interval.mjs";

export function resolveWebServiceConfiguration(environment, parseMetarStations) {
  return {
    airportDatabasePath: environment.NASR_DATABASE_PATH,
    metarStations: parseMetarStations(environment.METAR_STATIONS),
    logLevel: environment.LOG_LEVEL ?? "info",
    adsbLolPollIntervalMs: parseAdsbLolPollInterval(environment.ADSBLOL_POLL_INTERVAL_MS),
  };
}

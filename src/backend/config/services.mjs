import { default as parseAdsbLolPollInterval } from "./adsblol/poll-interval.mjs";
import { default as parseAdsbLolRemoteEnabled } from "./adsblol/remote-enabled.mjs";

function resolveWebServiceConfiguration(environment, parseMetarStations) {
  return {
    airportDatabasePath: environment.NASR_DATABASE_PATH,
    metarStations: parseMetarStations(environment.METAR_STATIONS),
    logLevel: environment.LOG_LEVEL ?? "info",
    adsbLolRemoteEnabled: parseAdsbLolRemoteEnabled(environment.ADSBLOL_REMOTE),
    adsbLolPollIntervalMs: parseAdsbLolPollInterval(environment.ADSBLOL_POLL_INTERVAL_MS),
  };
}
export default resolveWebServiceConfiguration;

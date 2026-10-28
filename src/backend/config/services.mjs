export function resolveWebServiceConfiguration(environment, parseMetarStations) {
  return {
    airportDatabasePath: environment.NASR_DATABASE_PATH,
    metarStations: parseMetarStations(environment.METAR_STATIONS),
    logLevel: environment.LOG_LEVEL ?? "info",
  };
}

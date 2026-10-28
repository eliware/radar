export function readAdsbEnvironment(environment = process.env) {
  return {
    host: environment.ADSB_HOST ?? "127.0.0.1",
    port: environment.ADSB_PORT ?? 30003,
    locationLatitude: environment.ADSB_LAT,
    locationLongitude: environment.ADSB_LON,
  };
}

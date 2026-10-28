import { expect, jest, test } from "@jest/globals";
import { resolveWebConfiguration } from "../../src/backend/configuration.mjs";

const parsers = {
  parseAdsbLocation: jest.fn((latitude, longitude) =>
    latitude ? { latitude: Number(latitude), longitude: Number(longitude) } : null,
  ),
  parseMetarStations: jest.fn((stations = "KLEW,KPWM,KBXM") => stations.split(",")),
};

test("resolves configured web and feed settings", () => {
  expect(
    resolveWebConfiguration(
      {
        PORT: "8080",
        ADSB_PORT: "30004",
        ADSB_HOST: "receiver",
        ADSB_LAT: "43",
        ADSB_LON: "-70",
        ADSB_ALT: "320",
        RADAR_DEFAULT_RANGE_NM: "25",
        RADAR_DEFAULT_ROTATION: "140",
        NASR_DATABASE_PATH: "nasr.sqlite",
        METAR_STATIONS: "KLEW,KPWM",
        LOG_LEVEL: "debug",
      },
      parsers,
    ),
  ).toEqual({
    port: 8080,
    feedPort: 30004,
    feedHost: "receiver",
    location: { latitude: 43, longitude: -70 },
    elevationFeet: 320,
    radarViewSettings: { defaultRangeNm: 25, defaultRotationDegrees: 140 },
    airportDatabasePath: "nasr.sqlite",
    metarStations: ["KLEW", "KPWM"],
    logLevel: "debug",
  });
});

test("provides defaults for web and service settings", () => {
  expect(resolveWebConfiguration({}, parsers)).toEqual({
    port: 3000,
    feedPort: 30003,
    feedHost: "127.0.0.1",
    location: null,
    elevationFeet: 300,
    radarViewSettings: { defaultRangeNm: 20, defaultRotationDegrees: 0 },
    airportDatabasePath: undefined,
    metarStations: ["KLEW", "KPWM", "KBXM"],
    logLevel: "info",
  });
});

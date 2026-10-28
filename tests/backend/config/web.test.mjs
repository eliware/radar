import { expect, test } from "@jest/globals";
import { resolveWebNetworkConfiguration } from "../../../src/backend/config/web.mjs";

const parseAdsbLocation = (latitude, longitude) => ({ latitude, longitude });

test("resolves web network and display settings", () => {
  expect(
    resolveWebNetworkConfiguration(
      {
        PORT: "8080",
        ADSB_PORT: "30004",
        ADSB_HOST: "receiver",
        ADSB_LAT: "43",
        ADSB_LON: "-70",
        ADSB_ALT: "320",
        RADAR_DEFAULT_RANGE_NM: "25",
        RADAR_DEFAULT_ROTATION: "140",
      },
      parseAdsbLocation,
    ),
  ).toEqual({
    port: 8080,
    feedPort: 30004,
    feedHost: "receiver",
    location: { latitude: "43", longitude: "-70" },
    elevationFeet: 320,
    radarViewSettings: { defaultRangeNm: 25, defaultRotationDegrees: 140 },
  });
});

test("rejects invalid ports and radar view settings", () => {
  expect(() => resolveWebNetworkConfiguration({ ADSB_PORT: "0" }, parseAdsbLocation)).toThrow(
    "ADSB_PORT must be an integer from 1 through 65535",
  );
  expect(() =>
    resolveWebNetworkConfiguration({ RADAR_DEFAULT_RANGE_NM: "301" }, parseAdsbLocation),
  ).toThrow("RADAR_DEFAULT_RANGE_NM must be a number from 1 through 300.");
});

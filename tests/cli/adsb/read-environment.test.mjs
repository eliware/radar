import { expect, test } from "@jest/globals";
import { readAdsbEnvironment } from "../../../src/cli/adsb/read-environment.mjs";

test("reads host, port, and home coordinates from the environment", () => {
  expect(
    readAdsbEnvironment({
      ADSB_HOST: "receiver.local",
      ADSB_PORT: "31003",
      ADSB_LAT: "43",
      ADSB_LON: "-70",
    }),
  ).toEqual({
    host: "receiver.local",
    port: "31003",
    locationLatitude: "43",
    locationLongitude: "-70",
  });
  expect(readAdsbEnvironment({})).toEqual({
    host: "127.0.0.1",
    port: 30003,
    locationLatitude: undefined,
    locationLongitude: undefined,
  });
});

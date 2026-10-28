import { expect, jest, test } from "@jest/globals";
import { prepareAdsbEnvironment } from "../../../src/cli/adsb/prepare-environment.mjs";
import { readAdsbEnvironment } from "../../../src/cli/adsb/read-environment.mjs";

test("loads dotenv before resolving ADS-B settings", () => {
  const loadEnvironment = jest.fn();
  const environment = { ADSB_HOST: "receiver.local", ADSB_PORT: "31003" };
  expect(prepareAdsbEnvironment({ loadEnvironment, environment })).toEqual({
    host: "receiver.local",
    port: "31003",
    locationLatitude: undefined,
    locationLongitude: undefined,
  });
  expect(loadEnvironment).toHaveBeenCalledTimes(1);
});

test("uses the default loader and process environment", () => {
  expect(prepareAdsbEnvironment()).toEqual(readAdsbEnvironment(process.env));
});

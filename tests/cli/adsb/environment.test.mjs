import { expect, jest, test } from "@jest/globals";
import {
  loadAdsbEnvironment,
  prepareAdsbEnvironment,
  readAdsbEnvironment,
} from "../../../src/cli/adsb/environment.mjs";

test("loads dotenv configuration quietly", () => {
  const load = jest.fn();
  loadAdsbEnvironment(load);
  expect(load).toHaveBeenCalledWith({ quiet: true });
});

test("loads dotenv before resolving the ADS-B environment", () => {
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

test("prepares the process environment with default loaders", () => {
  expect(prepareAdsbEnvironment()).toEqual(readAdsbEnvironment(process.env));
});

test("loads dotenv configuration with its default loader", () => {
  expect(() => loadAdsbEnvironment()).not.toThrow();
});

test("uses the local RTL1090 feed by default", () => {
  expect(readAdsbEnvironment({})).toEqual({
    host: "127.0.0.1",
    port: 30003,
    locationLatitude: undefined,
    locationLongitude: undefined,
  });
});

test("reads the process environment by default", () => {
  expect(readAdsbEnvironment()).toEqual(readAdsbEnvironment(process.env));
});

test("reads feed host and unparsed port text from the environment", () => {
  expect(readAdsbEnvironment({ ADSB_HOST: "receiver.local", ADSB_PORT: "31003" })).toEqual({
    host: "receiver.local",
    port: "31003",
    locationLatitude: undefined,
    locationLongitude: undefined,
  });
});

test("reads home coordinates from the environment", () => {
  expect(readAdsbEnvironment({ ADSB_LAT: "43", ADSB_LON: "-70" })).toMatchObject({
    locationLatitude: "43",
    locationLongitude: "-70",
  });
});

test("preserves a nonnumeric port for validation by the CLI parser", () => {
  expect(readAdsbEnvironment({ ADSB_PORT: "invalid" }).port).toBe("invalid");
});

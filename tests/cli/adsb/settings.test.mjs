import { afterEach, expect, test } from "@jest/globals";
import { resolveAdsbSettings } from "../../../src/cli/adsb/settings.mjs";

afterEach(() => {
  delete process.env.ADSB_HOST;
  delete process.env.ADSB_PORT;
  delete process.env.ADSB_LAT;
  delete process.env.ADSB_LON;
});

test("uses local feed environment defaults", () => {
  expect(resolveAdsbSettings({})).toEqual({
    host: "127.0.0.1",
    port: 30003,
    locationLatitude: undefined,
    locationLongitude: undefined,
  });
});

test("applies argument values ahead of environment settings", () => {
  process.env.ADSB_HOST = "receiver.local";
  process.env.ADSB_PORT = "31003";
  expect(resolveAdsbSettings({ host: "localhost", port: "30004", debug: true })).toEqual({
    host: "localhost",
    port: 30004,
    locationLatitude: undefined,
    locationLongitude: undefined,
    debug: true,
  });
});

test("preserves home coordinates from the environment", () => {
  process.env.ADSB_LAT = "43";
  process.env.ADSB_LON = "-70";
  expect(resolveAdsbSettings({ port: "30004" })).toMatchObject({
    port: 30004,
    locationLatitude: "43",
    locationLongitude: "-70",
  });
});

test("uses a validated argument port without resolving an overridden environment port", () => {
  process.env.ADSB_PORT = "bad";
  expect(resolveAdsbSettings({ port: "30004" }).port).toBe(30004);
});

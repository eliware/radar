import { afterEach, expect, test } from "@jest/globals";
import { parseAdsbOptions } from "../../../src/cli/adsb/options.mjs";

afterEach(() => {
  delete process.env.ADSB_HOST;
  delete process.env.ADSB_PORT;
  delete process.env.ADSB_LAT;
  delete process.env.ADSB_LON;
});

test("uses the local RTL1090 feed by default", () => {
  expect(parseAdsbOptions([])).toEqual({
    host: "127.0.0.1",
    port: 30003,
    locationLatitude: undefined,
    locationLongitude: undefined,
  });
});

test("combines environment defaults with explicit command-line overrides", () => {
  process.env.ADSB_HOST = "receiver.local";
  process.env.ADSB_PORT = "31003";
  expect(parseAdsbOptions(["--host", "localhost", "--port", "30004", "--debug"])).toEqual({
    host: "localhost",
    port: 30004,
    locationLatitude: undefined,
    locationLongitude: undefined,
    debug: true,
  });
});

test("composes home coordinates from environment with parsed CLI options", () => {
  process.env.ADSB_LAT = "43";
  process.env.ADSB_LON = "-70";
  expect(parseAdsbOptions(["--port", "30004"])).toMatchObject({
    port: 30004,
    locationLatitude: "43",
    locationLongitude: "-70",
  });
});

test("rejects an invalid port from the environment", () => {
  process.env.ADSB_PORT = "bad";
  expect(() => parseAdsbOptions([])).toThrow(
    "TCP endpoint number must be an integer from 1 through 65535",
  );
});

test.each(["nope", "0", "65536", "1.5"])("rejects invalid command-line port %s", (port) => {
  expect(() => parseAdsbOptions(["--port", port])).toThrow(
    "TCP endpoint number must be an integer from 1 through 65535",
  );
});

test("uses a validated command-line port without validating the overridden environment port", () => {
  process.env.ADSB_PORT = "bad";
  expect(parseAdsbOptions(["--port", "30004"]).port).toBe(30004);
});

test("rejects unknown command-line options", () => {
  expect(() => parseAdsbOptions(["--bad"])).toThrow("Unknown option: --bad");
});

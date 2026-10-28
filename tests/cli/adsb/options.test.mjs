import { afterEach, expect, test } from "@jest/globals";
import { parseAdsbOptions } from "../../../src/cli/adsb/options.mjs";

afterEach(() => {
  delete process.env.ADSB_HOST;
  delete process.env.ADSB_PORT;
});

test("uses the local RTL1090 feed by default", () => {
  expect(parseAdsbOptions([])).toEqual({ host: "127.0.0.1", port: 30003 });
});

test("combines environment defaults with explicit command-line overrides", () => {
  process.env.ADSB_HOST = "receiver.local";
  process.env.ADSB_PORT = "31003";
  expect(parseAdsbOptions(["--host", "localhost", "--port", "30004", "--debug"])).toEqual({
    host: "localhost",
    port: 30004,
    debug: true,
  });
});

test("rejects an invalid port from the environment", () => {
  process.env.ADSB_PORT = "bad";
  expect(() => parseAdsbOptions([])).toThrow(
    "TCP endpoint number must be an integer from 1 through 65535",
  );
});

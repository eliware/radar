import { afterEach, expect, test } from "@jest/globals";
import { parseAdsbOptions } from "../../src/cli/adsb-options.mjs";

afterEach(() => {
  delete process.env.ADSB_HOST;
  delete process.env.ADSB_PORT;
});

test("uses the local RTL1090 feed by default", () => {
  expect(parseAdsbOptions([])).toEqual({ host: "127.0.0.1", port: 30003 });
});

test("uses feed settings from the environment", () => {
  process.env.ADSB_HOST = "receiver.local";
  process.env.ADSB_PORT = "31003";
  expect(parseAdsbOptions([])).toEqual({ host: "receiver.local", port: 31003 });
});

test("accepts host, port, help, and version options", () => {
  expect(
    parseAdsbOptions(["--host", "localhost", "--port", "30004", "--help", "--version"]),
  ).toEqual({
    host: "localhost",
    port: 30004,
    help: true,
    version: true,
  });
});

test("accepts the version option", () => {
  expect(parseAdsbOptions(["--version"]).version).toBe(true);
});

test("accepts the debug option", () => {
  expect(parseAdsbOptions(["--debug"])).toEqual({
    host: "127.0.0.1",
    port: 30003,
    debug: true,
  });
});

test.each([["--other"], ["--host"], ["--port"], ["--host", "--help"]])(
  "rejects invalid option input %s",
  (...args) => {
    expect(() => parseAdsbOptions(args)).toThrow();
  },
);

test.each(["nope", "0", "65536", "1.5"])("rejects invalid port %s", (port) => {
  expect(() => parseAdsbOptions(["--port", port])).toThrow(
    "Port must be an integer from 1 through 65535",
  );
});

test("rejects an invalid port from the environment", () => {
  process.env.ADSB_PORT = "bad";
  expect(() => parseAdsbOptions([])).toThrow("Port must be an integer from 1 through 65535");
});

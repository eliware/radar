import { expect, test } from "@jest/globals";
import { parseAdsbArguments } from "../../../src/cli/adsb/arguments.mjs";

test("parses host, port, help, version, and debug options", () => {
  expect(
    parseAdsbArguments(["--host", "localhost", "--port", "30004", "--help", "--version"]),
  ).toEqual({ host: "localhost", port: 30004, help: true, version: true });
  expect(parseAdsbArguments(["--debug"])).toEqual({ debug: true });
  expect(parseAdsbArguments([])).toEqual({});
});

test.each([["--other"], ["--host"], ["--port"], ["--host", "--help"]])(
  "rejects invalid option input %s",
  (...args) => {
    expect(() => parseAdsbArguments(args)).toThrow();
  },
);

test.each(["nope", "0", "65536", "1.5"])("rejects invalid port %s", (port) => {
  expect(() => parseAdsbArguments(["--port", port])).toThrow(
    "TCP endpoint number must be an integer from 1 through 65535",
  );
});

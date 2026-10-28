import { expect, test } from "@jest/globals";
import { parseAdsbPort, resolveAdsbPort, validateAdsbPort } from "../../../src/cli/adsb/port.mjs";

test("converts command-line port text to a number", () => {
  expect(parseAdsbPort("30004")).toBe(30004);
  expect(parseAdsbPort("invalid")).toBeNaN();
});

test.each([1, 30004, 65535])("accepts TCP port %i", (port) => {
  expect(() => validateAdsbPort(port)).not.toThrow();
});

test.each([0, 65536, 1.5, "30004", Number.NaN])("rejects invalid TCP port %s", (port) => {
  expect(() => validateAdsbPort(port)).toThrow(
    "TCP endpoint number must be an integer from 1 through 65535",
  );
});

test("resolves and validates command-line or environment port text", () => {
  expect(resolveAdsbPort("31004", "30003")).toBe(31004);
  expect(resolveAdsbPort(undefined, "31003")).toBe(31003);
  expect(() => resolveAdsbPort(undefined, "invalid")).toThrow(
    "TCP endpoint number must be an integer from 1 through 65535",
  );
});

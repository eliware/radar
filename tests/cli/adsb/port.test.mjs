import { expect, test } from "@jest/globals";
import { parseAdsbPort, validateAdsbPort } from "../../../src/cli/adsb/port.mjs";

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

import { expect, test } from "@jest/globals";
import { validateAdsbPort } from "../../../src/cli/adsb/port.mjs";

test.each([1, 30004, 65535])("accepts TCP port %i", (port) => {
  expect(() => validateAdsbPort(port)).not.toThrow();
});

test.each([0, 65536, 1.5, "30004", Number.NaN])("rejects invalid TCP port %s", (port) => {
  expect(() => validateAdsbPort(port)).toThrow(
    "TCP endpoint number must be an integer from 1 through 65535",
  );
});

import { expect, test } from "@jest/globals";
import { resolveAdsbPort } from "../../../src/cli/adsb/resolve-port.mjs";

test("resolves and validates command-line or environment port text", () => {
  expect(resolveAdsbPort("31004", "30003")).toBe(31004);
  expect(resolveAdsbPort(undefined, "31003")).toBe(31003);
  expect(() => resolveAdsbPort(undefined, "invalid")).toThrow(
    "TCP endpoint number must be an integer from 1 through 65535",
  );
});

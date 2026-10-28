import { expect, test } from "@jest/globals";
import { parseAdsbPort } from "../../../src/cli/adsb/parse-port.mjs";

test("converts command-line port text to a number", () => {
  expect(parseAdsbPort("30004")).toBe(30004);
  expect(parseAdsbPort("invalid")).toBeNaN();
});

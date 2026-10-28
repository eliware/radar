import { expect, test } from "@jest/globals";
import { formatAircraftAge } from "../../../../src/cli/flight/strip/age.mjs";

test("formats elapsed aircraft age in whole seconds without negative values", () => {
  expect(formatAircraftAge({ lastSeen: 1500 }, 4999)).toBe("3s");
  expect(formatAircraftAge({ lastSeen: 5000 }, 4000)).toBe("0s");
});

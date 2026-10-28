import { expect, test } from "@jest/globals";
import { ilsSystemKey } from "../../../src/backend/ils/system-key.mjs";

test("builds a key from ILS system identity fields", () => {
  expect(ilsSystemKey({ faaId: "PWM", runwayEnd: "11", identifier: "PWM", systemType: "LD" })).toBe(
    "PWM:11:PWM:LD",
  );
});

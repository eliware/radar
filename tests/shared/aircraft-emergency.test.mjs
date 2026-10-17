import { expect, test } from "@jest/globals";
import { getAircraftEmergencyLabel } from "../../src/shared/aircraft-emergency.mjs";

test.each([
  [{ emergency: 1 }, "EMERG"],
  [{ emergency: -1 }, "EMERG"],
  [{ emergency: "general" }, "EMERG"],
  [{ emergency: 5 }, "HIJACK"],
  [{ emergency: "unlawful interference" }, "HIJACK"],
  [{ squawk: "7500" }, "HIJACK"],
  [{ squawk: 7600 }, "EMERG"],
  [{ squawk: "7700" }, "EMERG"],
  [{ squawk: "1200", emergency: 0 }, null],
  [{ squawk: "1200", emergency: "false" }, null],
])("classifies emergency status from %j", (aircraft, label) => {
  expect(getAircraftEmergencyLabel(aircraft)).toBe(label);
});

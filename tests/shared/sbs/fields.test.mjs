import { expect, test } from "@jest/globals";
import { parseSbsFields } from "../../../src/shared/sbs/fields.mjs";

test("maps empty columns and normalizes ICAO and numeric values", () => {
  const values = Array(22).fill("");
  values[0] = "MSG";
  values[1] = "1";
  values[4] = "abc123";
  values[11] = "bad";
  expect(parseSbsFields(values)).toMatchObject({
    recordType: "MSG",
    transmissionType: 1,
    sessionId: null,
    icao: "ABC123",
    callsign: null,
    altitudeFeet: "bad",
  });
});

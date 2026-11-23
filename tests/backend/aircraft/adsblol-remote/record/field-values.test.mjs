import { expect, test } from "@jest/globals";
import { default as mapRemoteAircraftFieldValues } from "../../../../../src/backend/aircraft/adsblol-remote/record/field-values.mjs";

test("maps trimmed text fields from a remote record", () => {
  expect(
    mapRemoteAircraftFieldValues({
      flight: " RPA3471 ",
      t: " E75L ",
      squawk: " 7700 ",
      emergency: " general ",
    }),
  ).toEqual({
    callsign: "RPA3471",
    aircraftTypeCode: "E75L",
    squawk: "7700",
    emergency: "general",
  });
});

test("omits non-text values and empty strings", () => {
  expect(
    mapRemoteAircraftFieldValues({
      flight: 7,
      t: " ",
      squawk: null,
    }),
  ).toEqual({});
});

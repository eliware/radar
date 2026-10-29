import { expect, test } from "@jest/globals";
import { mapRemoteAircraftFieldValues } from "../../../../../src/backend/aircraft/adsblol-remote/record/field-values.mjs";

test("maps numeric and trimmed text fields from a remote record", () => {
  expect(
    mapRemoteAircraftFieldValues({
      alt_baro: 12_000,
      gs: 240,
      track: 85,
      baro_rate: 500,
      flight: " RPA3471 ",
      t: " E75L ",
      squawk: " 7700 ",
      emergency: " general ",
    }),
  ).toEqual({
    altitudeFeet: 12_000,
    groundSpeedKnots: 240,
    trackDegrees: 85,
    verticalRateFeetPerMinute: 500,
    callsign: "RPA3471",
    aircraftTypeCode: "E75L",
    squawk: "7700",
    emergency: "general",
  });
});

test("uses alternate numeric fields and omits invalid optional values", () => {
  expect(
    mapRemoteAircraftFieldValues({
      alt_geom: 9_000,
      true_heading: 90,
      geom_rate: -200,
      flight: 7,
      gs: "240",
    }),
  ).toEqual({
    altitudeFeet: 9_000,
    trackDegrees: 90,
    verticalRateFeetPerMinute: -200,
  });
  expect(mapRemoteAircraftFieldValues({ track: Number.NaN })).toEqual({});
});

import { expect, test } from "@jest/globals";
import { default as mapRemoteAircraftNumericFields } from "../../../../../src/backend/aircraft/adsblol-remote/record/numeric-fields.mjs";

test("maps numeric ADS-B fields and their supported alternatives", () => {
  expect(
    mapRemoteAircraftNumericFields({
      alt_geom: 9000,
      gs: 240,
      true_heading: 90,
      geom_rate: -200,
    }),
  ).toEqual({
    altitudeFeet: 9000,
    groundSpeedKnots: 240,
    trackDegrees: 90,
    verticalRateFeetPerMinute: -200,
  });
});

test("omits invalid and absent numeric values", () => {
  expect(mapRemoteAircraftNumericFields({ gs: "240", track: Number.NaN })).toEqual({});
});

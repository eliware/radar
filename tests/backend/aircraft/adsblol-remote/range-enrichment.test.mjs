import { expect, test } from "@jest/globals";
import { enrichRemoteAircraftRange } from "../../../../src/backend/aircraft/adsblol-remote/range-enrichment.mjs";

test("adds local distance and bearing to a normalized remote aircraft", () => {
  const aircraft = { icao: "ABC123", latitude: 43.1, longitude: -70.2 };
  const enriched = enrichRemoteAircraftRange(aircraft, { latitude: 43, longitude: -70 });

  expect(enriched).toMatchObject({
    ...aircraft,
    distanceNauticalMiles: expect.any(Number),
    bearingDegrees: expect.any(Number),
  });
  expect(enriched.distanceNauticalMiles).toBeGreaterThan(0);
});

test("leaves range fields absent when no home location is configured", () => {
  expect(enrichRemoteAircraftRange({ icao: "ABC123", latitude: 43, longitude: -70 }, null)).toEqual(
    {
      icao: "ABC123",
      latitude: 43,
      longitude: -70,
    },
  );
});

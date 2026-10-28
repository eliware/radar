import { expect, test } from "@jest/globals";
import { classifyFlightAircraftNearHome } from "../../../src/frontend/flight/near-home.mjs";

test("adds near-home classification without changing stored aircraft", () => {
  const aircraft = [{ icao: "TEST", altitudeFeet: 1000 }];
  const classified = classifyFlightAircraftNearHome(aircraft, null, 0);
  expect(classified).toEqual([{ icao: "TEST", altitudeFeet: 1000, nearHomePass: false }]);
  expect(aircraft[0]).not.toHaveProperty("nearHomePass");
});

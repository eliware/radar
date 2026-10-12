import { expect, test } from "@jest/globals";
import { createRadarReferenceStore } from "../../src/frontend/radar-reference-store.mjs";

test("stores airports, navaids, and boundary paths by stable keys", () => {
  const store = createRadarReferenceStore();
  store.updateAirports([{ faaId: "PWM" }]);
  store.updateNavaids([{ state: "ME", identifier: "ENE" }]);
  store.updateBoundaries([{ id: "ZBW:LOW:ARTCC" }]);
  expect(store.airports.has("PWM")).toBe(true);
  expect(store.navaids.has("ME:ENE")).toBe(true);
  expect(store.boundaries.has("ZBW:LOW:ARTCC")).toBe(true);
});

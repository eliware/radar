import { expect, test } from "@jest/globals";
import { createRadarReferenceStore } from "../../src/frontend/radar-reference-store.mjs";

test("stores airport, navaid, boundary, and ILS records by stable keys", () => {
  const store = createRadarReferenceStore();
  store.updateAirports([{ faaId: "PWM" }]);
  store.updateNavaids([{ state: "ME", identifier: "ENE" }]);
  store.updateBoundaries([{ id: "ZBW:LOW:ARTCC" }]);
  store.updateIls([{ faaId: "PWM", runwayEnd: "11" }]);
  expect(store.airports.has("PWM")).toBe(true);
  expect(store.navaids.has("ME:ENE")).toBe(true);
  expect(store.boundaries.has("ZBW:LOW:ARTCC")).toBe(true);
  expect(store.ilsApproaches.has("PWM:11")).toBe(true);
});

import { expect, test } from "@jest/globals";
import {
  createAircraftMetadataStore,
  normalizeAircraftMetadataKey,
} from "../../../src/backend/aircraft/metadata-store.mjs";

test("normalizes keys and enriches aircraft with type and route data", () => {
  const store = createAircraftMetadataStore();
  expect(normalizeAircraftMetadataKey("  abC123 ")).toBe("ABC123");
  expect(normalizeAircraftMetadataKey(null)).toBe("");
  expect(store.updateType("ABC123", { aircraftTypeCode: "B738" })).toBe(true);
  expect(store.updateRoute("BAW15K", { origin: "EGLL", destination: "KBOS" })).toBe(true);
  expect(
    store.enrich({ icao: "abc123", callsign: "baw15k", aircraftTypeCode: "OLD" }),
  ).toMatchObject({ aircraftTypeCode: "B738", origin: "EGLL", destination: "KBOS" });
});

test("ignores empty lookup results and reports when lookup data changes", () => {
  const store = createAircraftMetadataStore();
  expect(store.updateType("ABC123", {})).toBe(false);
  expect(store.updateRoute("BAW15K", {})).toBe(false);
  expect(store.updateType("ABC123", { aircraftTypeCode: "B738" })).toBe(true);
  expect(store.updateType("ABC123", { aircraftTypeCode: "B738" })).toBe(false);
  expect(store.updateRoute("BAW15K", { origin: "EGLL" })).toBe(true);
  expect(store.updateRoute("BAW15K", { origin: "EGLL" })).toBe(false);
  expect(store.updateRoute("BAW15K", { destination: "KBOS" })).toBe(true);
});

test("evicts the least recently used result after the size limit", () => {
  const store = createAircraftMetadataStore(2);
  store.updateType("A", { aircraftTypeCode: "A320" });
  store.updateType("B", { aircraftTypeCode: "B738" });
  store.updateType("A", { aircraftTypeCode: "A320" });
  store.updateType("C", { aircraftTypeCode: "C172" });
  expect(store.enrich({ icao: "A" }).aircraftTypeCode).toBe("A320");
  expect(store.enrich({ icao: "B" }).aircraftTypeCode).toBeUndefined();
  expect(store.enrich({ icao: "C" }).aircraftTypeCode).toBe("C172");
});

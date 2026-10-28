import { expect, test } from "@jest/globals";
import { createAircraftEnrichmentState } from "../../../../src/backend/aircraft/enrichment/state.mjs";

test("normalizes aircraft metadata keys while preparing enriched state", () => {
  const state = createAircraftEnrichmentState();
  const update = state.update({ icao: " abc123 ", callsign: " BAW183 " });
  expect(update).toEqual({
    icao: "ABC123",
    callsign: "BAW183",
    aircraft: { icao: " abc123 ", callsign: " BAW183 " },
    enriched: { icao: " abc123 ", callsign: " BAW183 " },
  });
  expect(state.enrich(update.aircraft)).toEqual(update.enriched);
});

test("does not enrich aircraft without an identifier", () => {
  expect(createAircraftEnrichmentState().update({ callsign: "BAW183" })).toBeNull();
});

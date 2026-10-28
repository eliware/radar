import { expect, jest, test } from "@jest/globals";
import { createAdsbLolAircraftStore } from "../../../../src/backend/aircraft/adsblol-remote/aircraft-store.mjs";

const location = { latitude: 43.8, longitude: -70.4 };
const record = {
  hex: "ABC123",
  flight: "RPA1",
  lat: 43.9,
  lon: -70.3,
  seen_pos: 0,
};

test("coordinates route enrichment through the normalized track store", async () => {
  const store = createAdsbLolAircraftStore({
    location,
    lookup: { getCallsignRoute: jest.fn(async () => ({ origin: "KBOS" })) },
  });
  store.update({});
  store.update(record);
  await Promise.resolve();
  expect(store.list()).toMatchObject([{ icao: "ABC123", callsign: "RPA1", origin: "KBOS" }]);
});

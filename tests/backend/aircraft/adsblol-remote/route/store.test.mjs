import { expect, jest, test } from "@jest/globals";
import { createAdsbLolRouteStore } from "../../../../../src/backend/aircraft/adsblol-remote/route/store.mjs";

test("updates tracks before enriching mapped records and forwards enablement", async () => {
  const mapped = { icao: "ABC123", callsign: "RPA1" };
  const tracks = {
    update: jest.fn((record) => (record ? mapped : null)),
    get: jest.fn(() => mapped),
  };
  const routeLookup = { getCallsignRoute: jest.fn(async () => null) };
  const routeStore = createAdsbLolRouteStore({ tracks, lookup: routeLookup });
  routeStore.update(null);
  routeStore.update({ hex: "ABC123" });
  await Promise.resolve();
  routeStore.setEnabled(false);
  routeStore.update({ hex: "ABC123" });
  expect(tracks.update).toHaveBeenCalledTimes(3);
  expect(routeLookup.getCallsignRoute).toHaveBeenCalledTimes(1);
  expect(routeLookup.getCallsignRoute).toHaveBeenCalledWith("RPA1");
});

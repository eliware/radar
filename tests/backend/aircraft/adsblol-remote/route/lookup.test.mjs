import { expect, jest, test } from "@jest/globals";
import { createAdsbLolRouteLookup } from "../../../../../src/backend/aircraft/adsblol-remote/route/lookup.mjs";

const mapped = { icao: "ABC123", callsign: "RPA1" };

test("ignores results when the aircraft callsign has changed", async () => {
  let resolveRoute;
  const lookup = createAdsbLolRouteLookup({
    getCallsignRoute: jest.fn(() => new Promise((resolve) => (resolveRoute = resolve))),
  });
  const aircraft = new Map([[mapped.icao, mapped]]);
  const onResult = jest.fn();
  lookup.request(mapped, aircraft, onResult);
  aircraft.set(mapped.icao, { ...mapped, callsign: "RPA2" });
  resolveRoute({ origin: "KBOS" });
  await Promise.resolve();
  expect(onResult).not.toHaveBeenCalled();
});

test("does not start requests while route lookup is disabled", () => {
  const getCallsignRoute = jest.fn();
  const lookup = createAdsbLolRouteLookup({ getCallsignRoute });
  lookup.setEnabled(false);
  lookup.request(mapped, new Map([[mapped.icao, mapped]]), jest.fn());
  expect(getCallsignRoute).not.toHaveBeenCalled();
});

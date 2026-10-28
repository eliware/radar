import { expect, jest, test } from "@jest/globals";
import { createAdsbLolRouteLookup } from "../../../../../src/backend/aircraft/adsblol-remote/route/lookup.mjs";

const mapped = { icao: "ABC123", callsign: "RPA1" };

test("returns route results for the current callsign", async () => {
  const result = { origin: "KBOS" };
  const lookup = createAdsbLolRouteLookup({ getCallsignRoute: jest.fn(async () => result) });
  const onResult = jest.fn();
  lookup.request(mapped, new Map([[mapped.icao, mapped]]), onResult);
  await Promise.resolve();
  expect(onResult).toHaveBeenCalledWith(result);
});

test("ignores stale callsigns and requests after disable and re-enable", async () => {
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

  aircraft.set(mapped.icao, mapped);
  lookup.request(mapped, aircraft, onResult);
  lookup.setEnabled(false);
  lookup.setEnabled(true);
  resolveRoute({ origin: "KORD" });
  await Promise.resolve();
  expect(onResult).not.toHaveBeenCalled();
});

test("ignores missing services, empty results, and failures", async () => {
  const onResult = jest.fn();
  createAdsbLolRouteLookup().request(mapped, new Map(), onResult);
  createAdsbLolRouteLookup({ getCallsignRoute: async () => null }).request(
    mapped,
    new Map([[mapped.icao, mapped]]),
    onResult,
  );
  createAdsbLolRouteLookup({ getCallsignRoute: async () => Promise.reject() }).request(
    mapped,
    new Map([[mapped.icao, mapped]]),
    onResult,
  );
  await Promise.resolve();
  await Promise.resolve();
  expect(onResult).not.toHaveBeenCalled();
});

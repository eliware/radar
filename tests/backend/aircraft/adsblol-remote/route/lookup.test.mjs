import { expect, jest, test } from "@jest/globals";
import { createAdsbLolRouteLookup } from "../../../../../src/backend/aircraft/adsblol-remote/route/lookup.mjs";

const mapped = { icao: "ABC123", callsign: "RPA1" };

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

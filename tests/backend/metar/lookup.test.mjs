import { expect, jest, test } from "@jest/globals";
import { createMetarLookup } from "../../../src/backend/metar/lookup.mjs";

test("returns no reports and makes no request when no stations are set", async () => {
  const fetchData = jest.fn();
  const lookup = createMetarLookup([], { fetchData });
  expect(lookup.stations).toEqual([]);
  expect(await lookup.get()).toEqual([]);
  expect(fetchData).not.toHaveBeenCalled();
});

test("uses the default request functions when no options are given", () => {
  expect(createMetarLookup(["KPWM"]).stations).toEqual(["KPWM"]);
});

test("delegates configured station lookups to the request helper", async () => {
  const lookup = createMetarLookup(["KPWM"], {
    fetchData: async () => ({ ok: true, json: async () => [{ id: "KPWM", metar: "METAR" }] }),
  });
  await expect(lookup.get()).resolves.toEqual([{ id: "KPWM", metar: "METAR" }]);
});

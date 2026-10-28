import { expect, test } from "@jest/globals";
import { parseAdsbLolResponse } from "../../../../src/backend/aircraft/adsblol-remote/response.mjs";

test("extracts aircraft records from an ADSB.lol response", async () => {
  const aircraft = [{ hex: "abc123" }];
  expect(await parseAdsbLolResponse({ json: async () => ({ aircraft }) })).toBe(aircraft);
});

test("treats missing or invalid aircraft data as an empty response", async () => {
  expect(await parseAdsbLolResponse({ json: async () => ({}) })).toEqual([]);
  expect(await parseAdsbLolResponse({ json: async () => ({ aircraft: "invalid" }) })).toEqual([]);
  expect(await parseAdsbLolResponse({ json: async () => null })).toEqual([]);
});

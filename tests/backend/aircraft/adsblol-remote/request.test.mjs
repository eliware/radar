import { expect, jest, test } from "@jest/globals";
import { requestAdsbLolCircle } from "../../../../src/backend/aircraft/adsblol-remote/request.mjs";

test("parses aircraft data from the requested ADSB.lol circle", async () => {
  const aircraft = [{ hex: "abc123" }];
  const request = jest.fn(async () => ({ ok: true, json: async () => ({ aircraft }) }));
  expect(await requestAdsbLolCircle(request, { latitude: 43.8, longitude: -70.4 }, 25, "")).toBe(
    aircraft,
  );
  expect(request).toHaveBeenCalledTimes(1);
});

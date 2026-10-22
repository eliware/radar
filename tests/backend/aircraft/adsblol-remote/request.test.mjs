import { expect, jest, test } from "@jest/globals";
import { requestAdsbLolCircle } from "../../../../src/backend/aircraft/adsblol-remote/request.mjs";

test("requests an ADSB.lol circle with Radar contact details", async () => {
  const aircraft = [{ hex: "abc123" }];
  const request = jest.fn(async () => ({ ok: true, json: async () => ({ aircraft }) }));
  expect(await requestAdsbLolCircle(request, { latitude: 43.8, longitude: -70.4 }, 25)).toBe(
    aircraft,
  );
  expect(request).toHaveBeenCalledWith("https://re-api.adsb.lol/?circle=43.8,-70.4,25", {
    headers: {
      "user-agent": "EliwareRadar/15.0.0 (+https://radar.purinton.us; contact: radar@eliware.org)",
    },
  });
});

test("rejects failed requests and treats missing aircraft as an empty response", async () => {
  const location = { latitude: 43, longitude: -70 };
  await expect(
    requestAdsbLolCircle(async () => ({ ok: false, status: 503 }), location, 25),
  ).rejects.toThrow("HTTP 503");
  expect(
    await requestAdsbLolCircle(async () => ({ ok: true, json: async () => ({}) }), location, 25),
  ).toEqual([]);
});

import { afterEach, expect, jest, test } from "@jest/globals";
import { requestAdsbLolCircle } from "../../../../src/backend/aircraft/adsblol-remote/request.mjs";

const originalApiKey = process.env.ADSBLOL_API_KEY;

afterEach(() => {
  if (originalApiKey === undefined) delete process.env.ADSBLOL_API_KEY;
  else process.env.ADSBLOL_API_KEY = originalApiKey;
});

test("requests an ADSB.lol circle with Radar contact details", async () => {
  const aircraft = [{ hex: "abc123" }];
  const request = jest.fn(async () => ({ ok: true, json: async () => ({ aircraft }) }));
  expect(await requestAdsbLolCircle(request, { latitude: 43.8, longitude: -70.4 }, 25, "")).toBe(
    aircraft,
  );
  expect(request).toHaveBeenCalledWith("https://re-api.adsb.lol/?circle=43.8,-70.4,25", {
    headers: {
      "user-agent": "EliwareRadar/15.0.1 (+https://radar.purinton.us; contact: radar@eliware.org)",
    },
  });
});

test("uses the configured API key when no explicit key is passed", async () => {
  process.env.ADSBLOL_API_KEY = "environment-key";
  const request = jest.fn(async () => ({ ok: true, json: async () => ({ aircraft: [] }) }));
  await requestAdsbLolCircle(request, { latitude: 43, longitude: -70 }, 20);
  expect(request.mock.calls[0][1].headers["x-api-key"]).toBe("environment-key");
});

test("sends the configured key in the x-api-key header", async () => {
  const request = jest.fn(async () => ({ ok: true, json: async () => ({ aircraft: [] }) }));
  await requestAdsbLolCircle(request, { latitude: 43, longitude: -70 }, 20, "test-api-key");
  expect(request.mock.calls[0][1].headers).toEqual({
    "user-agent": "EliwareRadar/15.0.1 (+https://radar.purinton.us; contact: radar@eliware.org)",
    "x-api-key": "test-api-key",
  });
});

test("rejects failed HTTP requests", async () => {
  const location = { latitude: 43, longitude: -70 };
  await expect(
    requestAdsbLolCircle(async () => ({ ok: false, status: 503 }), location, 25, ""),
  ).rejects.toThrow("HTTP 503");
});

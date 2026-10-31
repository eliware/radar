import { expect, jest, test } from "@jest/globals";
import { requestAdsbLolCircle } from "../../../../../src/backend/aircraft/adsblol-remote/request/circle.mjs";

test("uses the API key supplied by the environment settings", async () => {
  const originalApiKey = process.env.ADSBLOL_API_KEY;
  process.env.ADSBLOL_API_KEY = "environment-key";
  const request = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ aircraft: [] }) });
  const onRequest = jest.fn();
  try {
    await requestAdsbLolCircle(request, { latitude: 43, longitude: -70 }, 25, undefined, onRequest);
    expect(request.mock.calls[0][1].headers["x-api-key"]).toBe("environment-key");
    expect(onRequest).toHaveBeenCalledWith({ radiusNm: 25, apiKeyHeaderPresent: true });
  } finally {
    if (originalApiKey === undefined) delete process.env.ADSBLOL_API_KEY;
    else process.env.ADSBLOL_API_KEY = originalApiKey;
  }
});

test("requests an ADSB.lol circle with Radar contact details", async () => {
  const aircraft = [{ hex: "abc123" }];
  const response = { ok: true, json: async () => ({ aircraft }) };
  const request = jest.fn().mockResolvedValue(response);
  await expect(
    requestAdsbLolCircle(request, { latitude: 43.8, longitude: -70.4 }, 25, ""),
  ).resolves.toBe(aircraft);
  expect(request).toHaveBeenCalledWith(
    "https://re-api.adsb.lol/?circle=43.8,-70.4,25",
    expect.objectContaining({ headers: expect.any(Object) }),
  );
});

test("reports an absent API key without exposing header values", async () => {
  const request = jest.fn().mockResolvedValue({ ok: true, json: async () => ({ aircraft: [] }) });
  const onRequest = jest.fn();
  await requestAdsbLolCircle(request, { latitude: 43, longitude: -70 }, 25, "", onRequest);
  expect(onRequest).toHaveBeenCalledWith({ radiusNm: 25, apiKeyHeaderPresent: false });
});

test("rejects failed HTTP requests", async () => {
  const location = { latitude: 43, longitude: -70 };
  await expect(
    requestAdsbLolCircle(async () => ({ ok: false, status: 503 }), location, 25, ""),
  ).rejects.toThrow("HTTP 503");
});

test("attaches Retry-After from a failed HTTP response", async () => {
  const response = { ok: false, status: 429, headers: { get: jest.fn(() => "45") } };
  await expect(
    requestAdsbLolCircle(async () => response, { latitude: 43, longitude: -70 }, 25, ""),
  ).rejects.toMatchObject({ retryAfterMs: 45000 });
  expect(response.headers.get).toHaveBeenCalledWith("retry-after");
});

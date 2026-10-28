import { expect, jest, test } from "@jest/globals";
import { requestAdsbLolCircle } from "../../../../../src/backend/aircraft/adsblol-remote/request/circle.mjs";

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

test("rejects failed HTTP requests", async () => {
  const location = { latitude: 43, longitude: -70 };
  await expect(
    requestAdsbLolCircle(async () => ({ ok: false, status: 503 }), location, 25, ""),
  ).rejects.toThrow("HTTP 503");
});

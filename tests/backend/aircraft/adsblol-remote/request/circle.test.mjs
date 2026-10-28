import { expect, jest, test } from "@jest/globals";
import { requestAdsbLolCircleResponse } from "../../../../../src/backend/aircraft/adsblol-remote/request/circle.mjs";

test("requests an ADSB.lol circle with Radar contact details", async () => {
  const response = { ok: true, json: jest.fn() };
  const request = jest.fn().mockResolvedValue(response);
  await expect(
    requestAdsbLolCircleResponse(request, { latitude: 43.8, longitude: -70.4 }, 25, ""),
  ).resolves.toBe(response);
  expect(request).toHaveBeenCalledWith(
    "https://re-api.adsb.lol/?circle=43.8,-70.4,25",
    expect.objectContaining({ headers: expect.any(Object) }),
  );
});

test("rejects failed HTTP requests", async () => {
  const location = { latitude: 43, longitude: -70 };
  await expect(
    requestAdsbLolCircleResponse(async () => ({ ok: false, status: 503 }), location, 25, ""),
  ).rejects.toThrow("HTTP 503");
});

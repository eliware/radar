import { expect, jest, test } from "@jest/globals";
import { requestAndApplyAdsbLolCircle } from "../../../../../src/backend/aircraft/adsblol-remote/polling/request.mjs";

const location = { latitude: 43.8, longitude: -70.4 };

function response(aircraft) {
  return { ok: true, json: async () => ({ aircraft }) };
}

test("requests circle records and applies them while the poll is current", async () => {
  const request = jest.fn(async () => response([{ hex: "ABC123" }, { hex: "DEF456" }]));
  const aircraft = { update: jest.fn() };
  const publish = jest.fn();

  await requestAndApplyAdsbLolCircle({
    request,
    location,
    radiusNm: 42,
    isCurrent: () => true,
    aircraft,
    publish,
  });

  expect(request).toHaveBeenCalledWith(
    expect.stringContaining("circle=43.8,-70.4,42"),
    expect.any(Object),
  );
  expect(aircraft.update.mock.calls).toEqual([[{ hex: "ABC123" }], [{ hex: "DEF456" }]]);
  expect(publish).toHaveBeenCalledTimes(1);
});

test("discards response records when the poll is no longer current", async () => {
  const request = jest.fn(async () => response([{ hex: "ABC123" }]));
  const aircraft = { update: jest.fn() };
  const publish = jest.fn();

  await requestAndApplyAdsbLolCircle({
    request,
    location,
    radiusNm: 42,
    isCurrent: () => false,
    aircraft,
    publish,
  });

  expect(aircraft.update).not.toHaveBeenCalled();
  expect(publish).not.toHaveBeenCalled();
});

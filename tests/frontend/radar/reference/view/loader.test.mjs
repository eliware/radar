import { expect, jest, test } from "@jest/globals";
import { createRadarReferenceViewLoader } from "../../../../../src/frontend/radar/reference/view/loader.mjs";

function setup(loadedThrough = 0) {
  const session = {
    setBounds: jest.fn(),
    add: jest.fn(),
    applyLatest: jest.fn(),
    clear: jest.fn(),
  };
  const scheduler = { loadedThrough, request: jest.fn() };
  return { loader: createRadarReferenceViewLoader(session, scheduler), session, scheduler };
}

const bounds = {
  minX: -10.2,
  maxX: 10.2,
  minZ: -10,
  maxZ: 10,
  minRangeNm: 0,
  maxRangeNm: 40,
};

test("updates bounds and schedules a rounded range once per viewport key", () => {
  const { loader, session, scheduler } = setup();
  loader.load(bounds);
  loader.load({ ...bounds, minX: -10.1, maxX: 10.1 });
  expect(session.setBounds).toHaveBeenCalledTimes(1);
  expect(session.setBounds).toHaveBeenCalledWith(bounds);
  expect(scheduler.request).toHaveBeenCalledWith(50);
  expect(scheduler.request).toHaveBeenCalledTimes(1);
});

test("clears when viewport bounds are missing or contain no visible range", () => {
  const { loader, session, scheduler } = setup();
  loader.load(null);
  loader.load({ ...bounds, minRangeNm: 50, maxRangeNm: 40 });
  expect(session.clear).toHaveBeenCalledTimes(2);
  expect(scheduler.request).not.toHaveBeenCalled();
});

test("applies cached layers and skips ranges already loaded", () => {
  const { loader, session, scheduler } = setup(50);
  loader.load(bounds);
  expect(session.applyLatest).toHaveBeenCalledTimes(1);
  expect(scheduler.request).not.toHaveBeenCalled();
});

test("caps a requested range at the radar limit", () => {
  const { loader, scheduler } = setup();
  loader.load({ ...bounds, maxRangeNm: 400 });
  expect(scheduler.request).toHaveBeenCalledWith(300);
});

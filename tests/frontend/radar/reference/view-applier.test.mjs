import { afterEach, expect, jest, test } from "@jest/globals";
import { createRadarReferenceViewApplier } from "../../../../src/frontend/radar/reference/view-applier.mjs";

afterEach(() => jest.useRealTimers());

test("applies the latest bounds after the debounce delay", () => {
  jest.useFakeTimers();
  const cache = { apply: jest.fn() };
  const scene = {};
  const location = { latitude: 43, longitude: -70 };
  const applier = createRadarReferenceViewApplier(cache, scene, location);
  applier.schedule({ id: "old" });
  const bounds = { id: "latest" };
  applier.schedule(bounds);
  jest.advanceTimersByTime(79);
  expect(cache.apply).not.toHaveBeenCalled();
  jest.advanceTimersByTime(1);
  expect(cache.apply).toHaveBeenCalledWith(scene, bounds, location);
});

test("cancels a pending view application", () => {
  jest.useFakeTimers();
  const cache = { apply: jest.fn() };
  const applier = createRadarReferenceViewApplier(cache, {}, {});
  applier.schedule({});
  applier.cancel();
  jest.advanceTimersByTime(80);
  expect(cache.apply).not.toHaveBeenCalled();
});

import { expect, test } from "@jest/globals";
import { default as createAircraftRadarAutoZoom } from "../../../../../src/frontend/create/aircraft/radar/auto-zoom.mjs";

test("tracks whether aircraft radar auto zoom is enabled", () => {
  const autoZoom = createAircraftRadarAutoZoom();
  expect(autoZoom.isEnabled()).toBe(true);
  autoZoom.disable();
  expect(autoZoom.isEnabled()).toBe(false);
  autoZoom.setEnabled(true);
  expect(autoZoom.isEnabled()).toBe(true);
});

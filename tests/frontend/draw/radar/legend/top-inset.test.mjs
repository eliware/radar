import { expect, test } from "@jest/globals";
import { default as radarLegendTopInset } from "../../../../../src/frontend/draw/radar/legend/top-inset.mjs";

test("adds an inset for touch-first screens", () => {
  expect(radarLegendTopInset({ matchMedia: () => ({ matches: true }) })).toBe(48);
  expect(radarLegendTopInset({ matchMedia: () => ({ matches: false }) })).toBe(0);
});

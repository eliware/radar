import { expect, test } from "@jest/globals";
import { radarLegendTopInset } from "../../../../../src/frontend/draw/radar/legend/top-inset.mjs";

test("adds an inset for touch-first screens", () => {
  expect(radarLegendTopInset({ matchMedia: () => ({ matches: true }) })).toBe(48);
  expect(radarLegendTopInset({ matchMedia: () => ({ matches: false }) })).toBe(0);
});

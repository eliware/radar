import { expect, test } from "@jest/globals";
import { findRadarLegendToggle } from "../../../../../src/frontend/draw/radar/legend/hit-test.mjs";
import { radarLegendLayout } from "../../../../../src/frontend/draw/radar/legend/entries.mjs";

test("finds legend shortcuts at their layout positions across columns and touch inset", () => {
  expect(findRadarLegendToggle(800, 400, 20, 152)).toBe("b");
  expect(findRadarLegendToggle(800, 400, 132, 24)).toBe("i");
  expect(findRadarLegendToggle(320, 400, 20, 280)).toBe("m");
  expect(findRadarLegendToggle(320, 400, 20, 296)).toBe("f");
  expect(findRadarLegendToggle(390, 844, 20, 72, 48)).toBe("l");
  expect(findRadarLegendToggle(320, 400, 200, 90)).toBeUndefined();
});

test("supports each shortcut entry", () => {
  radarLegendLayout(800, 400)
    .filter(({ entry }) => entry[4])
    .forEach(({ entry, x, y }) => {
      expect(findRadarLegendToggle(800, 400, x, y)).toBe(entry[4]);
    });
});

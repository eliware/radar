import { expect, test } from "@jest/globals";
import {
  radarLegendLayout,
  radarLegendTopInset,
} from "../../../../../src/frontend/draw/radar/legend/entries.mjs";

test("lays out clickable actions in the same one or two columns as the legend", () => {
  const desktop = radarLegendLayout(800, 400);
  const mobile = radarLegendLayout(320, 400);
  expect(desktop).toHaveLength(18);
  expect(desktop[8]).toMatchObject({ x: 12, y: 152, entry: expect.arrayContaining(["B BASE"]) });
  expect(desktop[9]).toMatchObject({ x: 124, y: 24, entry: expect.arrayContaining(["I ILS"]) });
  expect(mobile[16]).toMatchObject({ x: 12, y: 280 });
  const shortcuts = desktop.filter(({ entry }) => entry[4]).map(({ entry }) => entry[4]);
  expect(shortcuts).toEqual([
    "l",
    "a",
    "n",
    "r",
    "e",
    "b",
    "i",
    "d",
    "s",
    "q",
    "j",
    "v",
    "w",
    "m",
    "f",
  ]);
});

test("adds a mobile touch inset to the legend layout", () => {
  const mobileInset = radarLegendTopInset({
    matchMedia: () => ({ matches: true }),
  });
  const mobile = radarLegendLayout(390, 844, mobileInset);
  expect(mobile[0].y).toBe(72);
  expect(radarLegendLayout(390, 390, mobileInset)[1].y).toBe(86);
  expect(radarLegendTopInset({ matchMedia: () => ({ matches: false }) })).toBe(0);
});

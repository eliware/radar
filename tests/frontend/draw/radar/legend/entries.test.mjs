import { expect, test } from "@jest/globals";
import {
  findRadarLegendToggle,
  radarLegendLayout,
} from "../../../../../src/frontend/draw/radar/legend/entries.mjs";

test("lays out clickable actions in the same one or two columns as the legend", () => {
  const desktop = radarLegendLayout(800, 400);
  const mobile = radarLegendLayout(320, 400);
  expect(desktop).toHaveLength(17);
  expect(desktop[9]).toMatchObject({ x: 124, y: 218 });
  expect(mobile[15]).toMatchObject({ x: 12, y: 330 });
  expect(findRadarLegendToggle(320, 400, 20, 330)).toBe("m");
  expect(findRadarLegendToggle(320, 400, 20, 346)).toBe("f");
  expect(findRadarLegendToggle(320, 400, 20, 90)).toBeUndefined();
  const shortcuts = desktop.filter(({ entry }) => entry[4]).map(({ entry }) => entry[4]);
  expect(shortcuts).toEqual(["a", "n", "r", "e", "i", "d", "s", "q", "j", "v", "w", "m", "f"]);
  desktop
    .filter(({ entry }) => entry[4])
    .forEach(({ entry, x, y }) => {
      expect(findRadarLegendToggle(800, 400, x, y)).toBe(entry[4]);
    });
});

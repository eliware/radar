import { expect, jest, test } from "@jest/globals";
import { syncCanvasRadarVisibility } from "../../src/frontend/sync-canvas-radar-visibility.mjs";

test("copies each active layer visibility into canvas state", () => {
  const state = {};
  const layers = {
    ils: { isVisible: () => false },
    procedures: { isSidVisible: () => false, isStarVisible: () => true },
    airways: { isVisible: (type) => type !== "J" },
    runways: { isRunwaysVisible: () => false, isExtensionsVisible: () => true },
    references: { isAirportsVisible: () => false, isNavaidsVisible: () => true },
  };
  syncCanvasRadarVisibility(state, layers);
  expect(state).toEqual({
    ilsVisible: false,
    sidVisible: false,
    starVisible: true,
    airwayVisibility: { Q: true, J: false, V: true },
    runwaysVisible: false,
    extensionsVisible: true,
    airportsVisible: false,
    navaidsVisible: true,
  });
});

test("does not mutate its layer controllers", () => {
  const method = jest.fn(() => true);
  syncCanvasRadarVisibility(
    {},
    {
      ils: { isVisible: method },
      procedures: { isSidVisible: method, isStarVisible: method },
      airways: { isVisible: method },
      runways: { isRunwaysVisible: method, isExtensionsVisible: method },
      references: { isAirportsVisible: method, isNavaidsVisible: method },
    },
  );
  expect(method).toHaveBeenCalled();
});

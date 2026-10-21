import { expect, test } from "@jest/globals";
import { createCanvasRadarViewState } from "../../../../../src/frontend/create/canvas/radar/view-state.mjs";

test("sets the configured view defaults and enables reference layers", () => {
  expect(createCanvasRadarViewState(25, -Math.PI / 2)).toEqual({
    range: 25,
    defaultRangeNm: 25,
    autoZoom: true,
    offsetX: 0,
    offsetY: 0,
    rotation: -Math.PI / 2,
    defaultRotationRadians: -Math.PI / 2,
    connected: false,
    ilsVisible: true,
    sidVisible: true,
    starVisible: true,
    airwayVisibility: { Q: true, J: true, V: true },
    runwaysVisible: true,
    extensionsVisible: true,
    baseLegsVisible: true,
    airportsVisible: true,
    navaidsVisible: true,
  });
});

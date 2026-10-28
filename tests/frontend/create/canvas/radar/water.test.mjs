import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarWater } from "../../../../../src/frontend/create/canvas/radar/water.mjs";

test("composes the canvas water controller and exposes its lifecycle", () => {
  const documentRef = { addEventListener: jest.fn(), removeEventListener: jest.fn() };
  const windowRef = { fetch: jest.fn() };
  const water = createCanvasRadarWater(
    documentRef,
    windowRef,
    null,
    {},
    { range: 20, rotation: 0, offsetX: 0, offsetY: 0 },
    () => jest.fn(),
  );
  expect(water.data).toMatchObject({ paths: [], visible: true });
  expect(water.data.isVisible()).toBe(true);
  water.update();
  expect(windowRef.fetch).not.toHaveBeenCalled();
  water.destroy();
  expect(documentRef.removeEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
});

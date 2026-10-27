import { expect, test } from "@jest/globals";
import { createOverlayDrawer } from "../../../src/frontend/aircraft/overlay-draw.mjs";

test("creates a callable aircraft overlay renderer", () => {
  const draw = createOverlayDrawer({
    THREE: {},
    container: {},
    windowRef: {},
    canvas: {},
    context: {},
  });
  expect(draw).toEqual(expect.any(Function));
});

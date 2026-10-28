import { expect, jest, test } from "@jest/globals";
import { createCanvasRadarSurface } from "../../../src/frontend/canvas-radar/surface.mjs";

function setup(context = {}) {
  const canvas = {
    style: {},
    getContext: jest.fn(() => context),
    setAttribute: jest.fn(),
  };
  const container = { replaceChildren: jest.fn() };
  const documentRef = { createElement: jest.fn(() => canvas) };
  return { canvas, container, documentRef, context };
}

test("creates an accessible canvas surface and clears it on destroy", () => {
  const state = setup();
  const surface = createCanvasRadarSurface(state.container, state.documentRef);
  expect(surface).toMatchObject({ canvas: state.canvas, context: state.context });
  expect(state.canvas.setAttribute).toHaveBeenCalledWith("aria-label", "Top-down 2D radar view");
  expect(state.canvas.style.touchAction).toBe("none");
  expect(state.container.replaceChildren).toHaveBeenCalledWith(state.canvas);
  surface.destroy();
  expect(state.container.replaceChildren).toHaveBeenLastCalledWith();
});

test("reports when a 2D context cannot be created", () => {
  const state = setup(null);
  expect(() => createCanvasRadarSurface(state.container, state.documentRef)).toThrow(
    "Canvas 2D is unavailable",
  );
});

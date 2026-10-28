import { expect, jest, test } from "@jest/globals";
import { createAircraftOverlayCanvas } from "../../../../src/frontend/aircraft/overlay/canvas.mjs";

test("creates a non-interactive canvas and appends it to the container", () => {
  const context = {};
  const canvas = { style: {}, getContext: jest.fn(() => context) };
  const container = { appendChild: jest.fn() };
  const result = createAircraftOverlayCanvas(container, {
    createElement: jest.fn(() => canvas),
  });
  expect(result).toEqual({ canvas, context });
  expect(canvas.getContext).toHaveBeenCalledWith("2d");
  expect(canvas.style).toEqual({
    position: "absolute",
    inset: "0",
    zIndex: "1",
    pointerEvents: "none",
  });
  expect(container.appendChild).toHaveBeenCalledWith(canvas);
});

test("rejects browsers without a 2D canvas context", () => {
  expect(() =>
    createAircraftOverlayCanvas(
      { appendChild: jest.fn() },
      {
        createElement: () => ({ style: {}, getContext: () => null }),
      },
    ),
  ).toThrow("Canvas 2D is unavailable in this browser.");
});

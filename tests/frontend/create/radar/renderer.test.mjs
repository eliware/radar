import { expect, jest, test } from "@jest/globals";
import { createRadarRenderer } from "../../../../src/frontend/create/radar/renderer.mjs";

test("retries without antialiasing when the high quality context fails", () => {
  const renderer = { setPixelRatio: jest.fn() };
  const WebGLRenderer = jest
    .fn()
    .mockImplementationOnce(() => {
      throw new Error("context creation failed");
    })
    .mockReturnValueOnce(renderer);
  const result = createRadarRenderer({
    THREE: { WebGLRenderer },
    windowRef: { devicePixelRatio: 3 },
  });
  expect(result).toBe(renderer);
  expect(WebGLRenderer.mock.calls).toEqual([
    [{ antialias: true }],
    [{ antialias: false, powerPreference: "low-power" }],
  ]);
  expect(renderer.setPixelRatio).toHaveBeenCalledWith(2);
});

test("preserves a clear failure when WebGL stays unavailable", () => {
  const cause = new Error("unrecognized graphics initialization failure");
  const WebGLRenderer = jest.fn(() => {
    throw cause;
  });
  let failure;
  try {
    createRadarRenderer({ THREE: { WebGLRenderer }, windowRef: { devicePixelRatio: 1 } });
  } catch (error) {
    failure = error;
  }
  expect(failure.message).toBe("WebGL context unavailable");
  expect(failure.cause).toBe(cause);
});

test("uses a pixel ratio of one when the browser reports zero", () => {
  const renderer = { setPixelRatio: jest.fn() };
  createRadarRenderer({
    THREE: { WebGLRenderer: jest.fn(() => renderer) },
    windowRef: { devicePixelRatio: 0 },
  });

  expect(renderer.setPixelRatio).toHaveBeenCalledWith(1);
});

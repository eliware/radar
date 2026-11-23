import { expect, jest, test } from "@jest/globals";
import { default as attachRadarLegendRedraw } from "../../../../src/frontend/attach/radar-legend/redraw.mjs";

test("redraws when legend toggle keys are pressed and detaches cleanly", () => {
  const listeners = new Set();
  const documentRef = {
    addEventListener: (_type, listener) => listeners.add(listener),
    removeEventListener: (_type, listener) => listeners.delete(listener),
  };
  const redraw = jest.fn();
  const detach = attachRadarLegendRedraw(documentRef, redraw);
  listeners.forEach((listener) => listener({ key: "L" }));
  listeners.forEach((listener) => listener({ key: "M" }));
  listeners.forEach((listener) => listener({ key: "f" }));
  listeners.forEach((listener) => listener({ key: "x" }));
  expect(redraw).toHaveBeenCalledTimes(3);
  detach();
  expect(listeners.size).toBe(0);
});

test("returns a no-op detach function when the document cannot listen", () => {
  expect(attachRadarLegendRedraw({}, jest.fn())()).toBeUndefined();
});

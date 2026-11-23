import { expect, jest, test } from "@jest/globals";
import { default as attachAircraftOverlayLegendInteraction } from "../../../../src/frontend/aircraft/overlay/legend-interaction.mjs";

test("attaches and removes the legend click interaction", () => {
  let click;
  const container = {
    clientWidth: 320,
    clientHeight: 400,
    getBoundingClientRect: () => ({ left: 0, top: 0, width: 320, height: 400 }),
    addEventListener: jest.fn((_type, listener) => (click = listener)),
    removeEventListener: jest.fn(),
  };
  const documentRef = { dispatchEvent: jest.fn() };
  class KeyboardEvent {
    constructor(type, options) {
      Object.assign(this, { type }, options);
    }
  }
  const detach = attachAircraftOverlayLegendInteraction({
    container,
    documentRef,
    windowRef: { KeyboardEvent },
  });
  click({ clientX: 20, clientY: 24 });
  expect(documentRef.dispatchEvent).toHaveBeenCalledWith(
    expect.objectContaining({ type: "keydown", key: "l" }),
  );
  detach();
  expect(container.removeEventListener).toHaveBeenCalledWith("click", click);
});

import { expect, jest, test } from "@jest/globals";
import { attachRadarArrowControls } from "../../../../src/frontend/attach/radar/arrow-controls.mjs";

function setup(documentRef = {}) {
  const listeners = new Map();
  documentRef.addEventListener = jest.fn((name, callback) => listeners.set(name, callback));
  documentRef.removeEventListener = jest.fn();
  return { documentRef, sendKey: (event) => listeners.get("keydown")(event) };
}

test("maps arrow keys to zoom and rotation and removes its listener", () => {
  const state = setup();
  const view = { zoomBy: jest.fn(), rotateBy: jest.fn() };
  const preventDefault = jest.fn();
  const detach = attachRadarArrowControls(state.documentRef, view);
  for (const key of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"])
    state.sendKey({ key, preventDefault });

  expect(view.zoomBy.mock.calls).toEqual([[1 / 1.2], [1.2]]);
  expect(view.rotateBy.mock.calls).toEqual([[-Math.PI / 12], [Math.PI / 12]]);
  expect(preventDefault).toHaveBeenCalledTimes(4);
  detach();
  expect(state.documentRef.removeEventListener).toHaveBeenCalledWith(
    "keydown",
    expect.any(Function),
  );
});

test("ignores other keys, modifiers, and editable targets", () => {
  const state = setup();
  const view = { zoomBy: jest.fn(), rotateBy: jest.fn() };
  attachRadarArrowControls(state.documentRef, view);
  for (const event of [
    {},
    { key: "x" },
    { key: "ArrowUp", altKey: true },
    { key: "ArrowUp", ctrlKey: true },
    { key: "ArrowUp", metaKey: true },
    { key: "ArrowUp", target: { tagName: "INPUT" } },
    { key: "ArrowUp", target: { tagName: "TEXTAREA" } },
    { key: "ArrowUp", target: { tagName: "SELECT" } },
    { key: "ArrowUp", target: { isContentEditable: true } },
  ])
    state.sendKey(event);
  expect(view.zoomBy).not.toHaveBeenCalled();
  expect(view.rotateBy).not.toHaveBeenCalled();
});

test("supports missing event methods", () => {
  expect(attachRadarArrowControls(null, {})()).toBeUndefined();
  const detach = attachRadarArrowControls({ addEventListener: jest.fn() }, {});
  expect(() => detach()).not.toThrow();
});

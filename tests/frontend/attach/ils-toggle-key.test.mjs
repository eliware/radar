import { expect, jest, test } from "@jest/globals";
import { attachIlsToggleKey } from "../../../src/frontend/attach/ils-toggle-key.mjs";
import { createIlsVisibility } from "../../../src/frontend/create/ils-visibility.mjs";

function setup() {
  const listeners = new Map();
  const documentRef = {
    addEventListener: jest.fn((name, listener) => listeners.set(name, listener)),
    removeEventListener: jest.fn(),
  };
  return { documentRef, send: (event) => listeners.get("keydown")(event) };
}

test("toggles ILS on an I key and removes its listener", () => {
  const { documentRef, send } = setup();
  const changes = [];
  const visibility = createIlsVisibility(documentRef, (value) => changes.push(value));
  const preventDefault = jest.fn();
  send({ key: "i", preventDefault });
  expect(visibility.isVisible()).toBe(false);
  expect(changes).toEqual([false]);
  expect(preventDefault).toHaveBeenCalledTimes(1);
  visibility.destroy();
  expect(documentRef.removeEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
});

test("ignores other keys, modifiers, and editable targets", () => {
  const { documentRef, send } = setup();
  const toggle = jest.fn();
  attachIlsToggleKey(documentRef, toggle);
  for (const event of [
    { key: "x" },
    { key: "i", ctrlKey: true },
    { key: "i", metaKey: true },
    { key: "i", altKey: true },
    { key: "i", target: { tagName: "INPUT" } },
    { key: "i", target: { tagName: "TEXTAREA" } },
    { key: "i", target: { tagName: "SELECT" } },
    { key: "i", target: { isContentEditable: true } },
  ])
    send(event);
  expect(toggle).not.toHaveBeenCalled();
});

test("supports a document without event methods", () => {
  expect(() => attachIlsToggleKey(null, jest.fn())()).not.toThrow();
});

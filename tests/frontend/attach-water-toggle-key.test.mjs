import { expect, jest, test } from "@jest/globals";
import { attachWaterToggleKey } from "../../src/frontend/attach-water-toggle-key.mjs";

function setup() {
  let listener;
  const documentRef = {
    addEventListener: jest.fn((_name, callback) => (listener = callback)),
    removeEventListener: jest.fn(),
  };
  return { documentRef, send: (event) => listener(event) };
}

test("toggles water with W and removes the listener", () => {
  const { documentRef, send } = setup();
  const toggle = jest.fn();
  const preventDefault = jest.fn();
  const detach = attachWaterToggleKey(documentRef, toggle);

  send({ key: "W", preventDefault });

  expect(toggle).toHaveBeenCalledTimes(1);
  expect(preventDefault).toHaveBeenCalledTimes(1);
  detach();
  expect(documentRef.removeEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
});

test("ignores other keys, modifiers, and editable targets", () => {
  const { documentRef, send } = setup();
  const toggle = jest.fn();
  attachWaterToggleKey(documentRef, toggle);

  for (const event of [
    {},
    { key: "x" },
    { key: "w", altKey: true },
    { key: "w", ctrlKey: true },
    { key: "w", metaKey: true },
    { key: "w", target: { tagName: "INPUT" } },
    { key: "w", target: { tagName: "TEXTAREA" } },
    { key: "w", target: { tagName: "SELECT" } },
    { key: "w", target: { isContentEditable: true } },
  ])
    send(event);

  expect(toggle).not.toHaveBeenCalled();
});

test("supports missing event methods", () => {
  const detach = attachWaterToggleKey(null, jest.fn());
  expect(() => detach()).not.toThrow();

  let listener;
  const detachWithoutRemove = attachWaterToggleKey(
    { addEventListener: (_name, callback) => (listener = callback) },
    jest.fn(),
  );
  expect(() => detachWithoutRemove()).not.toThrow();
  expect(listener).toEqual(expect.any(Function));
});

import { expect, jest, test } from "@jest/globals";
import { attachFlightStripsToggle } from "../../src/frontend/attach-flight-strips-toggle.mjs";

function setup(hidden = false) {
  let listener;
  const classList = { toggle: jest.fn() };
  const documentRef = {
    addEventListener: jest.fn((_name, callback) => (listener = callback)),
    removeEventListener: jest.fn(),
  };
  const panel = { hidden };
  return {
    classList,
    documentRef,
    panel,
    send: (event) => listener(event),
    dashboard: { classList },
  };
}

test("toggles strips and layout with F, then removes its listener", () => {
  const { classList, documentRef, panel, send, dashboard } = setup();
  const detach = attachFlightStripsToggle(documentRef, dashboard, panel);
  const preventDefault = jest.fn();

  expect(classList.toggle).toHaveBeenNthCalledWith(1, "flight-strips-hidden", false);
  send({ key: "F", preventDefault });
  expect(panel.hidden).toBe(true);
  expect(classList.toggle).toHaveBeenLastCalledWith("flight-strips-hidden", true);
  send({ key: "f", preventDefault });
  expect(panel.hidden).toBe(false);
  expect(classList.toggle).toHaveBeenLastCalledWith("flight-strips-hidden", false);
  expect(preventDefault).toHaveBeenCalledTimes(2);
  detach();
  expect(documentRef.removeEventListener).toHaveBeenCalledWith("keydown", expect.any(Function));
});

test("ignores other keys, modifiers, and editable targets", () => {
  const { documentRef, send, dashboard, panel } = setup();
  attachFlightStripsToggle(documentRef, dashboard, panel);
  for (const event of [
    {},
    { key: "x" },
    { key: "f", altKey: true },
    { key: "f", ctrlKey: true },
    { key: "f", metaKey: true },
    { key: "f", target: { tagName: "INPUT" } },
    { key: "f", target: { tagName: "TEXTAREA" } },
    { key: "f", target: { tagName: "SELECT" } },
    { key: "f", target: { isContentEditable: true } },
  ])
    send(event);
  expect(panel.hidden).toBe(false);
});

test("supports missing document, layout, and remove methods", () => {
  expect(() => attachFlightStripsToggle(null, {}, {})()).not.toThrow();
  expect(() => attachFlightStripsToggle({ addEventListener: jest.fn() }, {}, {})()).not.toThrow();
  let listener;
  const detach = attachFlightStripsToggle(
    { addEventListener: (_name, callback) => (listener = callback) },
    { classList: { toggle: jest.fn() } },
    { hidden: false },
  );
  expect(listener).toEqual(expect.any(Function));
  expect(() => detach()).not.toThrow();
});

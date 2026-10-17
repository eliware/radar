import { expect, jest, test } from "@jest/globals";
import { attachMetarDisplayToggle } from "../../../src/frontend/attach/metar-display-toggle.mjs";

test("M toggles METAR visibility and refresh state", () => {
  let listener;
  const documentRef = {
    addEventListener: (_name, callback) => (listener = callback),
    removeEventListener: jest.fn(),
  };
  const panel = { hidden: false };
  const onEnabledChange = jest.fn();
  const detach = attachMetarDisplayToggle(documentRef, panel, onEnabledChange);
  const preventDefault = jest.fn();
  listener({ key: "M", target: {}, preventDefault });
  expect(panel.hidden).toBe(true);
  expect(onEnabledChange).toHaveBeenLastCalledWith(false);
  listener({ key: "m", target: {}, preventDefault });
  expect(panel.hidden).toBe(false);
  expect(onEnabledChange).toHaveBeenLastCalledWith(true);
  expect(preventDefault).toHaveBeenCalledTimes(2);
  detach();
  expect(documentRef.removeEventListener).toHaveBeenCalledWith("keydown", listener);
});

test("ignores unrelated, modified, and editable key events", () => {
  let listener;
  const panel = { hidden: false };
  attachMetarDisplayToggle({ addEventListener: (_name, fn) => (listener = fn) }, panel);
  for (const event of [
    {},
    { key: "x" },
    { key: "m", altKey: true },
    { key: "m", ctrlKey: true },
    { key: "m", metaKey: true },
    { key: "m", target: { tagName: "INPUT" } },
    { key: "m", target: { tagName: "TEXTAREA" } },
    { key: "m", target: { tagName: "SELECT" } },
    { key: "m", target: { isContentEditable: true } },
  ])
    listener(event);
  expect(panel.hidden).toBe(false);
});

test("supports missing document and panel", () => {
  const noDocument = attachMetarDisplayToggle(null, {});
  const noPanel = attachMetarDisplayToggle({ addEventListener: jest.fn() }, null);
  expect(() => noDocument()).not.toThrow();
  expect(() => noPanel()).not.toThrow();
  let listener;
  attachMetarDisplayToggle({ addEventListener: (_name, fn) => (listener = fn) }, { hidden: false });
  listener({ key: "m", target: {}, preventDefault: jest.fn() });
});

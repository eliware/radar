import { expect, jest, test } from "@jest/globals";
import { attachRadarLayerShortcuts } from "../../../../../src/frontend/create/radar/layer/shortcuts.mjs";

function setup() {
  const controllers = Object.fromEntries(
    ["airways", "references", "runways"].map((name) => [
      name,
      {
        isVisible: jest.fn(() => true),
        isAirportsVisible: jest.fn(() => true),
        isNavaidsVisible: jest.fn(() => true),
        isRunwaysVisible: jest.fn(() => true),
        isExtensionsVisible: jest.fn(() => true),
        isBaseLegsVisible: jest.fn(() => true),
        setVisible: jest.fn(),
        setAirportsVisible: jest.fn(),
        setNavaidsVisible: jest.fn(),
        setRunwaysVisible: jest.fn(),
        setExtensionsVisible: jest.fn(),
        setBaseLegsVisible: jest.fn(),
      },
    ]),
  );
  let listener;
  const documentRef = {
    addEventListener: jest.fn((_type, callback) => (listener = callback)),
    removeEventListener: jest.fn(),
  };
  return {
    controllers,
    documentRef,
    listener: () => listener,
    detach: attachRadarLayerShortcuts(documentRef, controllers),
  };
}

test("maps layer shortcut keys to their owning visibility controllers", () => {
  const state = setup();
  const preventDefault = jest.fn();
  for (const key of ["q", "j", "v", "a", "n", "r", "e", "b"])
    state.listener()({ key, target: {}, preventDefault });
  expect(state.controllers.airways.setVisible.mock.calls).toEqual([
    ["Q", false],
    ["J", false],
    ["V", false],
  ]);
  expect(state.controllers.references.setAirportsVisible).toHaveBeenCalledWith(false);
  expect(state.controllers.references.setNavaidsVisible).toHaveBeenCalledWith(false);
  expect(state.controllers.runways.setRunwaysVisible).toHaveBeenCalledWith(false);
  expect(state.controllers.runways.setExtensionsVisible).toHaveBeenCalledWith(false);
  expect(state.controllers.runways.setBaseLegsVisible).toHaveBeenCalledWith(false);
  expect(preventDefault).toHaveBeenCalledTimes(8);
  state.detach();
  expect(state.documentRef.removeEventListener).toHaveBeenCalledWith("keydown", state.listener());
});

test("ignores modified, unknown, and editable-target shortcuts", () => {
  const state = setup();
  const preventDefault = jest.fn();
  for (const event of [
    { key: "q", altKey: true },
    { key: "j", ctrlKey: true },
    { key: "v", metaKey: true },
    { key: "a", target: { tagName: "TEXTAREA" } },
    { key: "n", target: { isContentEditable: true } },
    { key: "x" },
  ])
    state.listener()({ target: {}, preventDefault, ...event });
  expect(preventDefault).not.toHaveBeenCalled();
  expect(state.controllers.airways.setVisible).not.toHaveBeenCalled();
});

test("allows missing document references", () => {
  expect(() => attachRadarLayerShortcuts(null, {})).not.toThrow();
});

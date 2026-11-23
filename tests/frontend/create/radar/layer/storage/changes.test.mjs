import { expect, jest, test } from "@jest/globals";
import { default as createLayerVisibilityChanges } from "../../../../../../src/frontend/create/radar/layer/storage/changes.mjs";

test("guards change callbacks until restoration finishes", () => {
  const changed = jest.fn();
  const changes = createLayerVisibilityChanges(changed);
  changes.ils(true);
  changes.procedures({ sidVisible: true, starVisible: true });
  changes.airways({ Q: true });
  changes.runways({ runwaysVisible: true, extensionsVisible: true, baseLegsVisible: true });
  changes.references({ airportsVisible: true, navaidsVisible: true });
  expect(changed).not.toHaveBeenCalled();
  changes.finishRestore();
  changes.ils(true);
  expect(changed).toHaveBeenCalledWith(true);
});

test("routes reference changes to the dedicated callback", () => {
  const changed = jest.fn();
  const referencesChanged = jest.fn();
  const changes = createLayerVisibilityChanges(changed, referencesChanged);
  changes.finishRestore();
  const value = { airportsVisible: false, navaidsVisible: true };
  changes.references(value);
  expect(referencesChanged).toHaveBeenCalledWith(value);
  expect(changed).not.toHaveBeenCalled();
});

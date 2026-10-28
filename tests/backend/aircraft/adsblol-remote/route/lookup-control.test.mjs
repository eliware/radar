import { expect, test } from "@jest/globals";
import { createAdsbLolRouteLookupControl } from "../../../../../src/backend/aircraft/adsblol-remote/route/lookup-control.mjs";

test("invalidates request generations when route lookup is disabled or re-enabled", () => {
  const control = createAdsbLolRouteLookupControl();
  const initial = control.generation();
  expect(control.isEnabled()).toBe(true);
  expect(control.isCurrent(initial)).toBe(true);
  control.setEnabled(false);
  const disabled = control.generation();
  expect(control.isEnabled()).toBe(false);
  expect(control.isCurrent(initial)).toBe(false);
  control.setEnabled(false);
  expect(control.generation()).toBe(disabled);
  control.setEnabled(true);
  expect(control.isEnabled()).toBe(true);
  expect(control.isCurrent(disabled)).toBe(false);
  expect(control.isCurrent(control.generation())).toBe(true);
});
test("coerces enabled values to booleans", () => {
  const control = createAdsbLolRouteLookupControl();
  control.setEnabled(0);
  expect(control.isEnabled()).toBe(false);
  control.setEnabled(1);
  expect(control.isEnabled()).toBe(true);
});

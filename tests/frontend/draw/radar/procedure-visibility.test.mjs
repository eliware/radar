import { expect, test } from "@jest/globals";
import { normalizeProcedureVisibility } from "../../../../src/frontend/draw/radar/procedure-visibility.mjs";

test("normalizes boolean procedure visibility and defaults both types to visible", () => {
  expect(normalizeProcedureVisibility()).toEqual({ sidVisible: true, starVisible: true });
  expect(normalizeProcedureVisibility(true)).toEqual({ sidVisible: true, starVisible: true });
  expect(normalizeProcedureVisibility(false)).toEqual({ sidVisible: false, starVisible: false });
});

test("preserves separate procedure visibility settings", () => {
  const visibility = { sidVisible: true, starVisible: false };
  expect(normalizeProcedureVisibility(visibility)).toBe(visibility);
});

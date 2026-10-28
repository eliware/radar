import { expect, test } from "@jest/globals";
import { hasCoarsePointer } from "../../src/frontend/has-coarse-pointer.mjs";

test("detects a coarse pointer only when the browser reports one", () => {
  expect(hasCoarsePointer({ matchMedia: () => ({ matches: true }) })).toBe(true);
  expect(hasCoarsePointer({ matchMedia: () => ({ matches: false }) })).toBe(false);
  expect(hasCoarsePointer({ matchMedia: () => undefined })).toBe(false);
  expect(hasCoarsePointer({})).toBe(false);
});

import { expect, test } from "@jest/globals";
import { DEFAULT_OUTPUT } from "../../../../src/backend/nasr/output-path.mjs";
import { selectNasrImportOutput } from "../../../../src/backend/nasr/import/output.mjs";

test("selects the default NASR output when none is provided", () => {
  expect(selectNasrImportOutput()).toBe(DEFAULT_OUTPUT);
});

test("preserves a caller supplied NASR output", () => {
  expect(selectNasrImportOutput("custom.sqlite")).toBe("custom.sqlite");
});

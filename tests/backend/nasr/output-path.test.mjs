import { isAbsolute } from "node:path";
import { expect, test } from "@jest/globals";
import { DEFAULT_OUTPUT } from "../../../src/backend/nasr/output-path.mjs";

test("resolves the bundled NASR database output from the module URL", () => {
  expect(isAbsolute(DEFAULT_OUTPUT)).toBe(true);
  expect(DEFAULT_OUTPUT.replaceAll("\\", "/")).toMatch(/\/nasr\/NASR\.sqlite$/);
});

import { expect, test } from "@jest/globals";
import { getTerminalWidth } from "../../../src/cli/terminal/width.mjs";

test("prefers the stdout window size", () => {
  expect(getTerminalWidth({ getWindowSize: () => [90], columns: 80 })).toBe(90);
});

test("falls back to stdout columns and then the standard width", () => {
  expect(getTerminalWidth({ getWindowSize: () => [], columns: 80 })).toBe(80);
  expect(getTerminalWidth({})).toBe(125);
});

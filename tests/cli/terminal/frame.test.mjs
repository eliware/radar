import { expect, test } from "@jest/globals";
import { renderTerminalFrame } from "../../../src/cli/terminal/frame.mjs";

const state = (overrides = {}) => ({
  isTTY: true,
  rows: 5,
  environment: {},
  alternateScreenActive: false,
  ...overrides,
});

test("renders plain frames for non-TTY output", () => {
  expect(renderTerminalFrame("frame", state({ isTTY: false }))).toEqual({
    output: "frame\n",
    alternateScreenActive: false,
  });
});

test("renders TTY frames in the alternate screen with optional synchronization", () => {
  expect(renderTerminalFrame("first\nsecond", state({ environment: { WT_SESSION: "1" } }))).toEqual(
    {
      output: "\u001b[?1049h\u001b[?25l\u001b[?2026h\u001b[Hfirst\nsecond\r\n\u001b[J\u001b[?2026l",
      alternateScreenActive: true,
    },
  );
  expect(renderTerminalFrame("next", state({ alternateScreenActive: true })).output).toBe(
    "\u001b[Hnext\r\n\u001b[J",
  );
});

test("omits clearing below a full frame and clears when terminal rows are unknown", () => {
  expect(renderTerminalFrame("frame", state({ rows: 1 })).output).toBe(
    "\u001b[?1049h\u001b[?25l\u001b[Hframe",
  );
  expect(renderTerminalFrame("frame", state({ rows: undefined })).output).toContain(
    "frame\r\n\u001b[J",
  );
});

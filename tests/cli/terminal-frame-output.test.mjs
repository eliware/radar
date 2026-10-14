import { expect, jest, test } from "@jest/globals";
import { createTerminalFrameOutput } from "../../src/cli/terminal-frame-output.mjs";

const prefix = "\u001b[2J\u001b[H";

test("writes plain text and non-TTY frames without control codes", () => {
  const stdout = { isTTY: false, write: jest.fn() };
  const output = createTerminalFrameOutput(stdout, {});
  output.write("status");
  output.write(`${prefix}frame`);
  expect(stdout.write.mock.calls.map(([text]) => text)).toEqual(["status\n", "frame\n"]);
  output.restore();
  expect(stdout.write).toHaveBeenCalledTimes(2);
});

test("writes TTY frames in a synchronized alternate screen and restores it", () => {
  const stdout = { isTTY: true, rows: 5, write: jest.fn() };
  const output = createTerminalFrameOutput(stdout, { WT_SESSION: "session" });
  output.write(`${prefix}first\nsecond`);
  output.write(`${prefix}next`);
  expect(stdout.write).toHaveBeenNthCalledWith(
    1,
    "\u001b[?1049h\u001b[?25l\u001b[?2026h\u001b[Hfirst\nsecond\r\n\u001b[J\u001b[?2026l",
  );
  expect(stdout.write.mock.calls[1][0]).not.toContain("\u001b[?1049h");
  expect(stdout.write.mock.calls[1][0]).toContain("\u001b[?2026h");
  output.restore();
  expect(stdout.write).toHaveBeenLastCalledWith("\u001b[?25h\u001b[?1049l");
  output.restore();
  expect(stdout.write).toHaveBeenCalledTimes(3);
});

test("skips below-frame clearing when the frame fills the terminal", () => {
  const stdout = { isTTY: true, rows: 1, write: jest.fn() };
  const output = createTerminalFrameOutput(stdout, {});
  output.write(`${prefix}frame`);
  expect(stdout.write.mock.calls[0][0]).toBe("\u001b[?1049h\u001b[?25l\u001b[Hframe");
  output.restore();
});

test("clears below a TTY frame when the row count is unknown", () => {
  const stdout = { isTTY: true, write: jest.fn() };
  const output = createTerminalFrameOutput(stdout, {});
  output.write(`${prefix}frame`);
  expect(stdout.write.mock.calls[0][0]).toContain("frame\r\n\u001b[J");
  output.restore();
});

test("reads terminal width from the best available source", () => {
  expect(createTerminalFrameOutput({ getWindowSize: () => [90], columns: 80 }, {}).getWidth()).toBe(
    90,
  );
  expect(createTerminalFrameOutput({ getWindowSize: () => [], columns: 80 }, {}).getWidth()).toBe(
    80,
  );
  expect(createTerminalFrameOutput({}, {}).getWidth()).toBe(125);
});

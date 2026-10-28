import { expect, jest, test } from "@jest/globals";
import { createTerminalFrameOutput } from "../../../src/cli/terminal/frame-output.mjs";

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

test("restores TTY output after writing a rendered frame", () => {
  const stdout = { isTTY: true, rows: 5, write: jest.fn() };
  const output = createTerminalFrameOutput(stdout, {});
  output.write(`${prefix}frame`);
  output.restore();
  expect(stdout.write).toHaveBeenLastCalledWith("\u001b[?25h\u001b[?1049l");
  output.restore();
  expect(stdout.write).toHaveBeenCalledTimes(2);
});

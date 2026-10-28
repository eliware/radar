import { expect, jest, test } from "@jest/globals";
import { createTerminalFrameOutput } from "../../../../src/cli/terminal/frame/output.mjs";

const prefix = "\u001b[2J\u001b[H";

test("routes ordinary text directly and frame-prefixed text through the screen session", () => {
  const stdout = { isTTY: true, rows: 5, write: jest.fn() };
  const output = createTerminalFrameOutput(stdout, {});
  output.write("status");
  output.write(`${prefix}frame`);
  expect(stdout.write.mock.calls[0][0]).toBe("status\n");
  expect(stdout.write.mock.calls[1][0]).toContain("\u001b[Hframe");
  expect(stdout.write.mock.calls[1][0]).not.toContain(prefix);
  output.restore();
});

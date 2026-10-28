import { expect, jest, test } from "@jest/globals";
import { restoreTerminalFrame } from "../../../../src/cli/terminal/frame/restore.mjs";

test("restores terminal cursor and screen", () => {
  const stdout = { write: jest.fn() };
  restoreTerminalFrame(stdout);
  expect(stdout.write).toHaveBeenCalledWith("\u001b[?25h\u001b[?1049l");
});

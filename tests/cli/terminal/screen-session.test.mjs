import { expect, jest, test } from "@jest/globals";
import { createTerminalScreenSession } from "../../../src/cli/terminal/screen-session.mjs";

test("keeps alternate-screen state across frames and restores it once", () => {
  const stdout = { isTTY: true, rows: 24, write: jest.fn() };
  const session = createTerminalScreenSession(stdout, {});
  session.render("first");
  session.render("second");
  expect(stdout.write.mock.calls[0][0]).toContain("\u001b[?1049h");
  expect(stdout.write.mock.calls[1][0]).not.toContain("\u001b[?1049h");
  session.restore();
  session.restore();
  expect(stdout.write).toHaveBeenLastCalledWith("\u001b[?25h\u001b[?1049l");
  expect(stdout.write).toHaveBeenCalledTimes(3);
});

test("does not restore an alternate screen for non-TTY output", () => {
  const stdout = { isTTY: false, write: jest.fn() };
  const session = createTerminalScreenSession(stdout, {});
  session.render("plain frame");
  session.restore();
  expect(stdout.write).toHaveBeenCalledWith("plain frame\n");
  expect(stdout.write).toHaveBeenCalledTimes(1);
});

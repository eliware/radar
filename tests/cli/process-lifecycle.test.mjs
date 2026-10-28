import { EventEmitter } from "node:events";
import { expect, jest, test } from "@jest/globals";
import { installCliProcessLifecycle } from "../../src/cli/process-lifecycle.mjs";

function setup({ table = true, isTTY = true } = {}) {
  const cli = { table, refresh: jest.fn(), close: jest.fn() };
  const terminalOutput = { restore: jest.fn() };
  const stdout = new EventEmitter();
  stdout.isTTY = isTTY;
  const processRef = new EventEmitter();
  const timer = {};
  const setIntervalFn = jest.fn(() => timer);
  const clearIntervalFn = jest.fn();
  const close = installCliProcessLifecycle({
    cli,
    terminalOutput,
    stdout,
    processRef,
    setIntervalFn,
    clearIntervalFn,
  });
  return { cli, terminalOutput, stdout, processRef, timer, setIntervalFn, clearIntervalFn, close };
}

test("starts refresh and closes resources on a signal", () => {
  const state = setup();
  expect(state.setIntervalFn).toHaveBeenCalledWith(expect.any(Function), 1000);
  state.setIntervalFn.mock.calls[0][0]();
  expect(state.cli.refresh).toHaveBeenCalledTimes(1);
  state.stdout.emit("resize");
  expect(state.cli.refresh).toHaveBeenCalledTimes(2);
  state.processRef.emit("SIGINT");
  state.close();
  expect(state.clearIntervalFn).toHaveBeenCalledWith(state.timer);
  expect(state.cli.close).toHaveBeenCalledTimes(1);
  expect(state.terminalOutput.restore).toHaveBeenCalledTimes(1);
  expect(state.stdout.listenerCount("resize")).toBe(0);
  expect(state.processRef.listenerCount("SIGTERM")).toBe(0);
});

test("does not schedule refresh or resize events for a non-table non-TTY CLI", () => {
  const state = setup({ table: false, isTTY: false });
  expect(state.setIntervalFn).not.toHaveBeenCalled();
  state.stdout.emit("resize");
  expect(state.cli.refresh).not.toHaveBeenCalled();
  state.processRef.emit("SIGTERM");
  expect(state.cli.close).toHaveBeenCalledTimes(1);
  expect(state.terminalOutput.restore).toHaveBeenCalledTimes(1);
});

test("restores terminal output when the process exits", () => {
  const state = setup({ table: false });
  state.processRef.emit("exit");
  expect(state.terminalOutput.restore).toHaveBeenCalledTimes(1);
  expect(state.cli.close).not.toHaveBeenCalled();
});

test("uses the default process, stdout, and timer functions", () => {
  const cli = { table: false, close: jest.fn() };
  const terminalOutput = { restore: jest.fn() };
  const close = installCliProcessLifecycle({ cli, terminalOutput });
  close();
  expect(cli.close).toHaveBeenCalledTimes(1);
  expect(terminalOutput.restore).toHaveBeenCalledTimes(1);
});

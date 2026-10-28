import { expect, jest, test } from "@jest/globals";
import { EventEmitter } from "node:events";
import { createCliBootstrap } from "../../src/cli/bootstrap.mjs";

test("wires terminal output into process lifecycle installation", () => {
  const stdout = {};
  const processRef = {};
  const environment = { TERM: "xterm" };
  const terminalOutput = { write: jest.fn(), restore: jest.fn() };
  const createTerminalOutput = jest.fn(() => terminalOutput);
  const installProcessLifecycle = jest.fn();
  const bootstrap = createCliBootstrap({
    stdout,
    processRef,
    environment,
    createTerminalOutput,
    installProcessLifecycle,
  });
  const cli = { close: jest.fn() };
  expect(bootstrap.terminalOutput).toBe(terminalOutput);
  expect(createTerminalOutput).toHaveBeenCalledWith(stdout, environment);
  bootstrap.install(cli);
  expect(installProcessLifecycle).toHaveBeenCalledWith({
    cli,
    terminalOutput,
    stdout,
    processRef,
  });
});

test("uses the default terminal and process lifecycle helpers", () => {
  const stdout = new EventEmitter();
  stdout.write = jest.fn();
  stdout.isTTY = false;
  const processRef = new EventEmitter();
  const bootstrap = createCliBootstrap({ stdout, processRef, environment: {} });
  const cli = { table: false, close: jest.fn() };
  const close = bootstrap.install(cli);
  close();
  expect(cli.close).toHaveBeenCalledTimes(1);
});

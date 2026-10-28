import { expect, jest, test } from "@jest/globals";
import { launchAdsbCli } from "../../../src/cli/adsb/launcher.mjs";

test("loads the environment, starts the CLI, and installs process lifecycle", () => {
  const terminalOutput = {
    getWidth: jest.fn(() => 90),
    write: jest.fn(),
  };
  const cli = { close: jest.fn() };
  const loadEnvironment = jest.fn();
  const createBootstrap = jest.fn(() => ({ terminalOutput, install: jest.fn() }));
  const startCli = jest.fn(() => cli);
  const stdout = {};
  const processRef = {};
  const environment = { ADSB_HOST: "receiver.local" };

  const launched = launchAdsbCli({
    args: ["--help"],
    stdout,
    processRef,
    environment,
    loadEnvironment,
    createBootstrap,
    startCli,
  });
  expect(launched).toEqual({ cli, close: undefined });
  expect(loadEnvironment).toHaveBeenCalledTimes(1);
  expect(createBootstrap).toHaveBeenCalledWith({ stdout, processRef, environment });
  expect(startCli).toHaveBeenCalledWith(
    expect.objectContaining({
      args: ["--help"],
      getTerminalWidth: terminalOutput.getWidth,
      write: terminalOutput.write,
      writeError: console.error,
      setExitCode: expect.any(Function),
    }),
  );
  startCli.mock.calls[0][0].setExitCode(2);
  expect(processRef.exitCode).toBe(2);
  expect(createBootstrap.mock.results[0].value.install).toHaveBeenCalledWith(cli);
});

test("uses launcher defaults and closes installed process lifecycle", () => {
  const previousArguments = process.argv;
  const previousWrite = process.stdout.write;
  process.argv = [process.argv[0], process.argv[1], "--help"];
  let launched;
  process.stdout.write = () => true;
  try {
    launched = launchAdsbCli();
  } finally {
    process.argv = previousArguments;
    process.stdout.write = previousWrite;
  }
  expect(launched.cli.close).toEqual(expect.any(Function));
  expect(launched.close).toEqual(expect.any(Function));
  launched.cli.close();
  launched.close();
});

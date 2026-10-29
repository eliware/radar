import { expect, jest, test } from "@jest/globals";
import { createAdsbCliBootstrapOptions } from "../../../src/cli/adsb/bootstrap-options.mjs";

test("assembles CLI options from bootstrap terminal output and prepared settings", () => {
  const terminalOutput = { getWidth: jest.fn(() => 90), write: jest.fn() };
  const bootstrap = { terminalOutput, install: jest.fn() };
  const createBootstrap = jest.fn(() => bootstrap);
  const processRef = {};
  const stdout = {};
  const environment = { ADSB_HOST: "receiver.local" };
  const environmentSettings = { host: "receiver.local" };
  const result = createAdsbCliBootstrapOptions({
    args: ["--help"],
    stdout,
    processRef,
    environment,
    environmentSettings,
    createBootstrap,
  });
  expect(createBootstrap).toHaveBeenCalledWith({ stdout, processRef, environment });
  expect(result.bootstrap).toBe(bootstrap);
  expect(result.cliOptions).toEqual({
    args: ["--help"],
    getTerminalWidth: terminalOutput.getWidth,
    write: terminalOutput.write,
    writeError: console.error,
    environmentSettings,
    setExitCode: expect.any(Function),
  });
  result.cliOptions.setExitCode(2);
  expect(processRef.exitCode).toBe(2);
});

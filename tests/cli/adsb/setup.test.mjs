import { expect, jest, test } from "@jest/globals";
import { createAdsbCliSetup } from "../../../src/cli/adsb/setup.mjs";

test("prepares environment and bootstrap options for the launcher", () => {
  const terminalOutput = { getWidth: jest.fn(() => 90), write: jest.fn() };
  const install = jest.fn(() => "close");
  const prepareEnvironment = jest.fn(() => ({ host: "receiver.local" }));
  const createBootstrap = jest.fn(() => ({ terminalOutput, install }));
  const processRef = {};
  const stdout = {};
  const environment = { ADSB_HOST: "receiver.local" };
  const setup = createAdsbCliSetup({
    args: ["--help"],
    stdout,
    processRef,
    environment,
    prepareEnvironment,
    createBootstrap,
  });
  expect(prepareEnvironment).toHaveBeenCalledWith({ environment });
  expect(createBootstrap).toHaveBeenCalledWith({ stdout, processRef, environment });
  expect(setup.cliOptions).toEqual(
    expect.objectContaining({
      args: ["--help"],
      getTerminalWidth: terminalOutput.getWidth,
      write: terminalOutput.write,
      environmentSettings: { host: "receiver.local" },
      setExitCode: expect.any(Function),
    }),
  );
  setup.cliOptions.setExitCode(2);
  expect(processRef.exitCode).toBe(2);
  const cli = {};
  expect(setup.install(cli)).toBe("close");
  expect(install).toHaveBeenCalledWith(cli);
});

test("uses process defaults when setup options are omitted", () => {
  const setup = createAdsbCliSetup();
  expect(setup.cliOptions.args).toEqual(expect.any(Array));
  expect(setup.cliOptions.environmentSettings).toEqual(expect.any(Object));
  expect(setup.install).toEqual(expect.any(Function));
});

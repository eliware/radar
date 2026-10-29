import { createCliBootstrap } from "../bootstrap.mjs";
import { prepareAdsbEnvironment } from "./prepare-environment.mjs";

export function createAdsbCliSetup({
  args = process.argv.slice(2),
  stdout = process.stdout,
  processRef = process,
  environment = process.env,
  prepareEnvironment = prepareAdsbEnvironment,
  createBootstrap = createCliBootstrap,
} = {}) {
  const environmentSettings = prepareEnvironment({ environment });
  const bootstrap = createBootstrap({ stdout, processRef, environment });
  const { terminalOutput } = bootstrap;
  return {
    cliOptions: {
      args,
      getTerminalWidth: terminalOutput.getWidth,
      write: terminalOutput.write,
      writeError: console.error,
      environmentSettings,
      setExitCode: (code) => {
        processRef.exitCode = code;
      },
    },
    install: bootstrap.install,
  };
}

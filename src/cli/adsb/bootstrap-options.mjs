import { createCliBootstrap } from "../bootstrap.mjs";

export function createAdsbCliBootstrapOptions({
  args,
  stdout,
  processRef,
  environment,
  environmentSettings,
  createBootstrap = createCliBootstrap,
}) {
  const bootstrap = createBootstrap({ stdout, processRef, environment });
  const { terminalOutput } = bootstrap;
  return {
    bootstrap,
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
  };
}

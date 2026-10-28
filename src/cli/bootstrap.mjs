import { installCliProcessLifecycle } from "./process-lifecycle.mjs";
import { createTerminalFrameOutput } from "./terminal/frame/output.mjs";

export function createCliBootstrap({
  stdout,
  processRef,
  environment,
  createTerminalOutput = createTerminalFrameOutput,
  installProcessLifecycle = installCliProcessLifecycle,
}) {
  const terminalOutput = createTerminalOutput(stdout, environment);
  return {
    terminalOutput,
    install(cli) {
      return installProcessLifecycle({ cli, terminalOutput, stdout, processRef });
    },
  };
}

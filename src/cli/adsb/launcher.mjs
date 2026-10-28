import { createCliBootstrap } from "../bootstrap.mjs";
import { prepareAdsbEnvironment } from "./environment.mjs";
import { startAdsbCli } from "./cli.mjs";

export function launchAdsbCli({
  args = process.argv.slice(2),
  stdout = process.stdout,
  processRef = process,
  environment = process.env,
  prepareEnvironment = prepareAdsbEnvironment,
  createBootstrap = createCliBootstrap,
  startCli = startAdsbCli,
} = {}) {
  const adsbEnvironment = prepareEnvironment({ environment });
  const bootstrap = createBootstrap({ stdout, processRef, environment });
  const { terminalOutput } = bootstrap;
  const cli = startCli({
    args,
    getTerminalWidth: terminalOutput.getWidth,
    write: terminalOutput.write,
    writeError: console.error,
    environmentSettings: adsbEnvironment,
    setExitCode: (code) => {
      processRef.exitCode = code;
    },
  });
  const close = bootstrap.install(cli);
  return { cli, close };
}

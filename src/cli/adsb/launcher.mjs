import { createCliBootstrap } from "../bootstrap.mjs";
import { loadAdsbEnvironment } from "./environment.mjs";
import { startAdsbCli } from "./cli.mjs";

export function launchAdsbCli({
  args = process.argv.slice(2),
  stdout = process.stdout,
  processRef = process,
  environment = process.env,
  loadEnvironment = loadAdsbEnvironment,
  createBootstrap = createCliBootstrap,
  startCli = startAdsbCli,
} = {}) {
  loadEnvironment();
  const bootstrap = createBootstrap({ stdout, processRef, environment });
  const { terminalOutput } = bootstrap;
  const cli = startCli({
    args,
    getTerminalWidth: terminalOutput.getWidth,
    write: terminalOutput.write,
    writeError: console.error,
    setExitCode: (code) => {
      processRef.exitCode = code;
    },
  });
  const close = bootstrap.install(cli);
  return { cli, close };
}

#!/usr/bin/env node
import { adsbCliDependencies, startAdsbCli } from "../src/cli/adsb/cli.mjs";
import { loadAdsbEnvironment } from "../src/cli/adsb/environment.mjs";
import { createCliBootstrap } from "../src/cli/bootstrap.mjs";

loadAdsbEnvironment();

const bootstrap = createCliBootstrap({
  stdout: process.stdout,
  processRef: process,
  environment: process.env,
});
const { terminalOutput } = bootstrap;

const cli = startAdsbCli({
  args: process.argv.slice(2),
  dependencies: adsbCliDependencies,
  getTerminalWidth: terminalOutput.getWidth,
  write: terminalOutput.write,
  writeError: console.error,
  setExitCode: (code) => {
    process.exitCode = code;
  },
});
bootstrap.install(cli);

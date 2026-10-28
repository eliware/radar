#!/usr/bin/env node
import { adsbCliDependencies, startAdsbCli } from "../src/cli/adsb/cli.mjs";
import { installCliProcessLifecycle } from "../src/cli/process-lifecycle.mjs";
import { createTerminalFrameOutput } from "../src/cli/terminal-frame-output.mjs";
import { config } from "dotenv";

config({ quiet: true });

const terminalOutput = createTerminalFrameOutput(process.stdout, process.env);

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
installCliProcessLifecycle({ cli, terminalOutput });

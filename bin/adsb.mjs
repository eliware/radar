#!/usr/bin/env node
import { adsbCliDependencies, startAdsbCli } from "../src/cli/adsb/cli.mjs";
import { startTableRefresh } from "../src/cli/table-refresh.mjs";
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
const stopTableRefresh = cli.table
  ? startTableRefresh(() => cli.refresh(), setInterval, clearInterval)
  : () => undefined;

const onResize = () => cli.refresh?.();
if (process.stdout.isTTY) process.stdout.on("resize", onResize);
const close = () => {
  stopTableRefresh();
  process.stdout.off("resize", onResize);
  cli.close();
  terminalOutput.restore();
};
process.once("exit", terminalOutput.restore);
process.once("SIGINT", close);
process.once("SIGTERM", close);

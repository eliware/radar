#!/usr/bin/env node
import { adsbCliDependencies, startAdsbCli } from "../src/adsb-cli.mjs";
import { startTableRefresh } from "../src/table-refresh.mjs";
import { config } from "dotenv";

config({ quiet: true });
const cli = startAdsbCli({
  args: process.argv.slice(2),
  dependencies: adsbCliDependencies,
  getTerminalWidth: () => process.stdout.columns ?? 125,
  write: console.log,
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
};
process.once("SIGINT", close);
process.once("SIGTERM", close);

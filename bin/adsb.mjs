#!/usr/bin/env node
import { adsbCliDependencies, startAdsbCli } from "../src/cli/adsb-cli.mjs";
import { startTableRefresh } from "../src/cli/table-refresh.mjs";
import { config } from "dotenv";

config({ quiet: true });

const framePrefix = "\u001b[2J\u001b[H";
let alternateScreenActive = false;
const writeOutput = (text) => {
  if (!text.startsWith(framePrefix)) {
    process.stdout.write(`${text}\n`);
    return;
  }
  const frame = text.slice(framePrefix.length);
  if (!process.stdout.isTTY) {
    process.stdout.write(`${frame}\n`);
    return;
  }
  let enterAlternateScreen = "";
  if (!alternateScreenActive) {
    enterAlternateScreen = "\u001b[?1049h\u001b[?25l";
    alternateScreenActive = true;
  }
  const synchronizedOutput = process.env.WT_SESSION ? "\u001b[?2026h" : "";
  const endSynchronizedOutput = synchronizedOutput ? "\u001b[?2026l" : "";
  const hasRoomBelowFrame =
    frame.split("\n").length < (process.stdout.rows ?? Number.MAX_SAFE_INTEGER);
  const clearBelowFrame = hasRoomBelowFrame ? "\r\n\u001b[J" : "";
  process.stdout.write(
    `${enterAlternateScreen}${synchronizedOutput}\u001b[H${frame}${clearBelowFrame}${endSynchronizedOutput}`,
  );
};
const restoreTerminal = () => {
  if (!alternateScreenActive) return;
  process.stdout.write("\u001b[?25h\u001b[?1049l");
  alternateScreenActive = false;
};
const getTerminalWidth = () => process.stdout.getWindowSize?.()[0] || process.stdout.columns || 125;

const cli = startAdsbCli({
  args: process.argv.slice(2),
  dependencies: adsbCliDependencies,
  getTerminalWidth,
  write: writeOutput,
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
  restoreTerminal();
};
process.once("exit", restoreTerminal);
process.once("SIGINT", close);
process.once("SIGTERM", close);

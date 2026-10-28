import { restoreTerminalFrame } from "./restore.mjs";

export function createTerminalFrameWriter(stdout) {
  return {
    write(output) {
      stdout.write(output);
    },
    restore() {
      restoreTerminalFrame(stdout);
    },
  };
}

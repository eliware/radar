import { createTerminalScreenSession } from "../screen-session.mjs";

const FRAME_PREFIX = "\u001b[2J\u001b[H";

export function createTerminalFrameOutput(stdout, environment) {
  const screen = createTerminalScreenSession(stdout, environment);
  return {
    write(text) {
      if (!text.startsWith(FRAME_PREFIX)) {
        stdout.write(`${text}\n`);
        return;
      }
      screen.render(text.slice(FRAME_PREFIX.length));
    },
    restore: screen.restore,
  };
}

import { renderTerminalFrame } from "./frame.mjs";

const FRAME_PREFIX = "\u001b[2J\u001b[H";

export function createTerminalFrameOutput(stdout, environment) {
  let alternateScreenActive = false;
  return {
    write(text) {
      if (!text.startsWith(FRAME_PREFIX)) {
        stdout.write(`${text}\n`);
        return;
      }
      const rendered = renderTerminalFrame(text.slice(FRAME_PREFIX.length), {
        isTTY: stdout.isTTY,
        rows: stdout.rows,
        environment,
        alternateScreenActive,
      });
      alternateScreenActive = rendered.alternateScreenActive;
      stdout.write(rendered.output);
    },
    restore() {
      if (!alternateScreenActive) return;
      stdout.write("\u001b[?25h\u001b[?1049l");
      alternateScreenActive = false;
    },
    getWidth() {
      return stdout.getWindowSize?.()[0] || stdout.columns || 125;
    },
  };
}

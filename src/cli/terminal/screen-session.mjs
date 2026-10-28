import { renderTerminalFrame } from "./frame.mjs";
import { createTerminalFrameWriter } from "./frame/writer.mjs";

export function createTerminalScreenSession(stdout, environment) {
  const writer = createTerminalFrameWriter(stdout);
  let alternateScreenActive = false;
  return {
    render(frame) {
      const rendered = renderTerminalFrame(frame, {
        isTTY: stdout.isTTY,
        rows: stdout.rows,
        environment,
        alternateScreenActive,
      });
      alternateScreenActive = rendered.alternateScreenActive;
      writer.write(rendered.output);
    },
    restore() {
      if (!alternateScreenActive) return;
      writer.restore();
      alternateScreenActive = false;
    },
  };
}

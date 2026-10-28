import { renderTerminalFrame } from "./frame.mjs";

export function createTerminalScreenSession(stdout, environment) {
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
      stdout.write(rendered.output);
    },
    restore() {
      if (!alternateScreenActive) return;
      stdout.write("\u001b[?25h\u001b[?1049l");
      alternateScreenActive = false;
    },
  };
}

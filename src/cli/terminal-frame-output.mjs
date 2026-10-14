const FRAME_PREFIX = "\u001b[2J\u001b[H";

export function createTerminalFrameOutput(stdout, environment) {
  let alternateScreenActive = false;
  return {
    write(text) {
      if (!text.startsWith(FRAME_PREFIX)) {
        stdout.write(`${text}\n`);
        return;
      }
      const frame = text.slice(FRAME_PREFIX.length);
      if (!stdout.isTTY) {
        stdout.write(`${frame}\n`);
        return;
      }
      const enter = alternateScreenActive ? "" : "\u001b[?1049h\u001b[?25l";
      alternateScreenActive = true;
      const synchronized = environment.WT_SESSION ? "\u001b[?2026h" : "";
      const endSynchronized = synchronized ? "\u001b[?2026l" : "";
      const hasRoomBelow = frame.split("\n").length < (stdout.rows ?? Number.MAX_SAFE_INTEGER);
      const clearBelow = hasRoomBelow ? "\r\n\u001b[J" : "";
      stdout.write(`${enter}${synchronized}\u001b[H${frame}${clearBelow}${endSynchronized}`);
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

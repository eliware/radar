export function createTerminalFrameWriter(stdout) {
  return {
    write(output) {
      stdout.write(output);
    },
    restore() {
      stdout.write("\u001b[?25h\u001b[?1049l");
    },
  };
}

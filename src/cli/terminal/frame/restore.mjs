export function restoreTerminalFrame(stdout) {
  stdout.write("\u001b[?25h\u001b[?1049l");
}

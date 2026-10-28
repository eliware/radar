export function getTerminalWidth(stdout) {
  return stdout.getWindowSize?.()[0] || stdout.columns || 125;
}

export function renderTerminalFrame(frame, { isTTY, rows, environment, alternateScreenActive }) {
  if (!isTTY) return { output: `${frame}\n`, alternateScreenActive };
  const enter = alternateScreenActive ? "" : "\u001b[?1049h\u001b[?25l";
  const synchronized = environment.WT_SESSION ? "\u001b[?2026h" : "";
  const endSynchronized = synchronized ? "\u001b[?2026l" : "";
  const hasRoomBelow = frame.split("\n").length < (rows ?? Number.MAX_SAFE_INTEGER);
  const clearBelow = hasRoomBelow ? "\r\n\u001b[J" : "";
  return {
    output: `${enter}${synchronized}\u001b[H${frame}${clearBelow}${endSynchronized}`,
    alternateScreenActive: true,
  };
}

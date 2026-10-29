export function measureAircraftTag(context, item, fontSize) {
  context.font = `${fontSize}px Consolas, "Courier New", monospace`;
  const height = fontSize * 1.15 * item.lines.length + 8;
  const lineWidths = item.lines.map((line) => context.measureText(line).width);
  const emergencyWidth = item.emergencyTag
    ? context.measureText(item.emergencyTag).width + fontSize
    : 0;
  const width = Math.max(...lineWidths) + emergencyWidth + 14;
  return { width, height, candidates: createCandidates(item, width, height) };
}

function createCandidates(item, width, height) {
  const gap = 12;
  return [
    { x: item.x + gap, y: item.y - height - gap },
    { x: item.x + gap, y: item.y + gap },
    { x: item.x - width - gap, y: item.y - height - gap },
    { x: item.x - width - gap, y: item.y + gap },
    { x: item.x - width / 2, y: item.y - height - gap },
    { x: item.x - width / 2, y: item.y + gap },
  ];
}

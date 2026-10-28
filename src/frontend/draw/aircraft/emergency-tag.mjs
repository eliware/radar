export function drawAircraftEmergencyTag(context, tag, fontSize) {
  const label = tag.item.emergencyTag;
  if (!label) return;
  const lineWidth = Math.max(...tag.item.lines.map((line) => context.measureText(line).width));
  context.fillText(label, tag.x + lineWidth + fontSize + 7, tag.y + fontSize);
}

export function createAircraftTagCandidates(item, width, height) {
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

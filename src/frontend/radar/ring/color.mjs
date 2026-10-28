export function getRadarRingColor(connected, major) {
  if (!connected) return major ? 0x3a3a3a : 0x202020;
  return major ? 0x006b26 : 0x003814;
}

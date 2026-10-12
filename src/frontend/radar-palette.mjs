export function getRadarPalette(connected) {
  return connected
    ? { bright: "#00ff41", major: "#006b26", minor: "#003814", trail: "#006b26" }
    : { bright: "#555555", major: "#3a3a3a", minor: "#202020", trail: "#303030" };
}

export function getRadarRingColor(connected, major) {
  if (!connected) return major ? 0x3a3a3a : 0x202020;
  return major ? 0x006b26 : 0x003814;
}

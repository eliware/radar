export function getRadarPalette(connected) {
  return connected
    ? { bright: "#00ff41", major: "#006b26", minor: "#003814", trail: "#006b26" }
    : { bright: "#555555", major: "#3a3a3a", minor: "#202020", trail: "#303030" };
}

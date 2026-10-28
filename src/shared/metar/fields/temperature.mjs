export function fahrenheitText(celsius) {
  return celsius == null ? "—" : `${Math.round((celsius * 9) / 5 + 32)}°F`;
}

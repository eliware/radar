export function readToggleState(key) {
  try {
    return globalThis.localStorage.getItem(`radar.visibility.${key}`) !== "false";
  } catch {
    return true;
  }
}

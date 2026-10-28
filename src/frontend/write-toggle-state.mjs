export function writeToggleState(key, visible) {
  try {
    globalThis.localStorage.setItem(`radar.visibility.${key}`, String(visible));
  } catch {
    // Keep the current session usable when browser storage is unavailable.
  }
}

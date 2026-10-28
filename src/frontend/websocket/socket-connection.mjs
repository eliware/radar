export function createSocketConnection(WebSocketClass, url) {
  try {
    return new WebSocketClass(url);
  } catch {
    return null;
  }
}

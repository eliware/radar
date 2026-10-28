export function dispatchViewportMessage(message, socket, feed) {
  try {
    const request = JSON.parse(message.toString());
    if (request.type !== "viewport") return;
    feed.setClientRadius?.(socket, request.radiusNm);
    feed.setClientLocalOnly?.(socket, request.localOnly);
  } catch {}
}

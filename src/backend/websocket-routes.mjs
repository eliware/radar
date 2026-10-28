export function registerWebSocketRoutes(app, feed) {
  app.get("/ws", { websocket: true }, (socket) => {
    const unsubscribe = feed.subscribe((snapshot) => {
      if (socket.readyState === 1) socket.send(JSON.stringify(snapshot));
    }, socket);
    socket.on("message", (message) => handleViewportMessage(message, socket, feed));
    socket.on("close", unsubscribe);
    socket.on("error", unsubscribe);
  });
}

function handleViewportMessage(message, socket, feed) {
  try {
    const request = JSON.parse(message.toString());
    if (request.type === "viewport") {
      feed.setClientRadius?.(socket, request.radiusNm);
      feed.setClientLocalOnly?.(socket, request.localOnly);
    }
  } catch {}
}

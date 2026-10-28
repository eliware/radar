import { dispatchViewportMessage } from "./websocket/viewport-message.mjs";

export function registerWebSocketRoutes(app, feed) {
  app.get("/ws", { websocket: true }, (socket) => {
    const unsubscribe = feed.subscribe((snapshot) => {
      if (socket.readyState === 1) socket.send(JSON.stringify(snapshot));
    }, socket);
    socket.on("message", (message) => dispatchViewportMessage(message, socket, feed));
    socket.on("close", unsubscribe);
    socket.on("error", unsubscribe);
  });
}

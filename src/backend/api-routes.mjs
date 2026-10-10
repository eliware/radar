export function registerApiRoutes(app, feed, { location = null, elevationFeet = 300 } = {}) {
  app.get("/health", async () => ({ status: "ok" }));
  app.get("/api/config", async () => ({ location, elevationFeet }));
  app.get("/api/aircraft", async () => feed.list());
  app.get("/ws", { websocket: true }, (socket) => {
    const unsubscribe = feed.subscribe((aircraft) => {
      if (socket.readyState === 1) socket.send(JSON.stringify(aircraft));
    });
    socket.on("close", unsubscribe);
    socket.on("error", unsubscribe);
  });
}

export function registerCoreRoutes(
  app,
  feed,
  { location = null, elevationFeet = 300, defaultRangeNm = 20, defaultRotationDegrees = 0 } = {},
) {
  app.get("/health", async () => ({ status: "ok" }));
  app.get("/ready", async (_request, reply) => {
    if (feed.isReady()) return { status: "ready" };
    reply.code(503);
    return { status: "not_ready" };
  });
  app.get("/api/config", async () => ({
    location,
    elevationFeet,
    defaultRangeNm,
    defaultRotationDegrees,
  }));
  app.get("/api/aircraft", async () => feed.list());
}

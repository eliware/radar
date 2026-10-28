export function registerRouteLookupControl(app, feed) {
  app.post("/api/route-lookups", async (request, reply) => {
    const enabled = request.body?.enabled;
    if (typeof enabled !== "boolean")
      return reply.code(400).send({ error: "enabled must be a boolean." });
    if (typeof feed.setRouteLookupsEnabled !== "function")
      return reply.code(501).send({ error: "Route lookups are not available." });
    feed.setRouteLookupsEnabled(enabled);
    return { enabled };
  });
}

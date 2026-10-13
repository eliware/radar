export function registerMetarRoutes(app, lookup) {
  app.get("/api/metar", async (_request, reply) => {
    try {
      return { stations: lookup.stations, reports: await lookup.get() };
    } catch {
      return reply.code(502).send({ error: "VATSIM METAR data is not available." });
    }
  });
}

import { isValidRangeBand } from "./reference/range/validation.mjs";

export function registerAirspaceBoundaryRoutes(app, database, location) {
  app.get("/api/airspace-boundaries", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "NASR database is not available." });
    if (!location) return reply.code(503).send({ error: "Home location is not configured." });
    const min = Number(request.query.minRangeNm ?? 0);
    const max = Number(request.query.maxRangeNm);
    if (!isValidRangeBand(min, max)) {
      return reply.code(400).send({ error: "Use a valid range from 0 to 300 nautical miles." });
    }
    return database.findBoundariesBetween(location, min, max);
  });
}

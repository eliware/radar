import { isValidRangeBand } from "../reference/range/validation.mjs";

export function registerAirportRoutes(app, database, location) {
  app.get("/api/airports", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "NASR database is not available." });
    if (!location) return reply.code(503).send({ error: "Home location is not configured." });
    const minRangeNm = Number(request.query.minRangeNm ?? 0);
    const maxRangeNm = Number(request.query.maxRangeNm);
    if (!isValidRangeBand(minRangeNm, maxRangeNm)) {
      return reply.code(400).send({ error: "Use a valid range from 0 to 300 nautical miles." });
    }
    return database.findBetween(location, minRangeNm, maxRangeNm);
  });
}

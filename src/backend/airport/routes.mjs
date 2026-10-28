import { parseRangeQuery } from "../reference/range/parameters.mjs";

export function registerAirportRoutes(app, database, location) {
  app.get("/api/airports", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "NASR database is not available." });
    if (!location) return reply.code(503).send({ error: "Home location is not configured." });
    const range = parseRangeQuery(request.query, reply);
    if (!range.valid) return range.response;
    const { minRangeNm, maxRangeNm } = range;
    return database.findBetween(location, minRangeNm, maxRangeNm);
  });
}

import { parseRangeQuery } from "../reference/range/parameters.mjs";

export function registerAirwayRoutes(app, database, location) {
  app.get("/api/airways", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "NASR database is not available." });
    if (!location) return reply.code(503).send({ error: "Home location is not configured." });
    const range = parseRangeQuery(request.query, reply);
    if (!range.valid) return range.response;
    const { minRangeNm, maxRangeNm } = range;
    return database.findAirwaysBetween(location, minRangeNm, maxRangeNm);
  });
}

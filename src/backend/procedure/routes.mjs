export function registerProcedureRoutes(app, database, location) {
  app.get("/api/procedures", async (request, reply) => {
    if (!database) return reply.code(503).send({ error: "NASR database is not available." });
    if (!location) return reply.code(503).send({ error: "Home location is not configured." });
    const minRangeNm = Number(request.query.minRangeNm ?? 0);
    const maxRangeNm = Number(request.query.maxRangeNm);
    if (!validRange(minRangeNm, maxRangeNm)) {
      return reply.code(400).send({ error: "Use a valid range from 0 to 300 nautical miles." });
    }
    return database.findProceduresBetween(location, minRangeNm, maxRangeNm);
  });
}

function validRange(minRangeNm, maxRangeNm) {
  return (
    Number.isFinite(minRangeNm) &&
    Number.isFinite(maxRangeNm) &&
    minRangeNm >= 0 &&
    maxRangeNm > minRangeNm &&
    maxRangeNm <= 300
  );
}

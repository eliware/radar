import { default as createMetarResponse } from "./response.mjs";

function registerMetarRoutes(app, lookup) {
  app.get("/api/metar", async (_request, reply) => {
    try {
      const reports = await lookup.get();
      return createMetarResponse(lookup.stations, reports);
    } catch {
      return reply.code(502).send({ error: "VATSIM METAR data is not available." });
    }
  });
}
export default registerMetarRoutes;

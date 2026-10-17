import { decodeMetarReport } from "./decoder.mjs";

export function registerMetarRoutes(app, lookup) {
  app.get("/api/metar", async (_request, reply) => {
    try {
      const reports = (await lookup.get()).map((report) => decodeMetarReport(report));
      return { stations: lookup.stations, reports };
    } catch {
      return reply.code(502).send({ error: "VATSIM METAR data is not available." });
    }
  });
}

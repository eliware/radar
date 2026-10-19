import { registerAirportRoutes } from "./airport/routes.mjs";
import { registerNavaidRoutes } from "./navaid-routes.mjs";
import { registerAirspaceBoundaryRoutes } from "./airspace-boundary-routes.mjs";
import { registerIlsApproachRoutes } from "./ils/approach/routes.mjs";
import { registerProcedureRoutes } from "./procedure/routes.mjs";
import { registerAirwayRoutes } from "./airway/routes.mjs";
import { registerMetarRoutes } from "./metar/routes.mjs";

export function registerApiRoutes(
  app,
  feed,
  {
    location = null,
    elevationFeet = 300,
    defaultRangeNm = 20,
    defaultRotationDegrees = 0,
    airportDatabase = null,
    metarLookup = null,
  } = {},
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
  registerAirportRoutes(app, airportDatabase, location);
  registerNavaidRoutes(app, airportDatabase, location);
  registerAirspaceBoundaryRoutes(app, airportDatabase, location);
  registerIlsApproachRoutes(app, airportDatabase, location);
  registerProcedureRoutes(app, airportDatabase, location);
  registerAirwayRoutes(app, airportDatabase, location);
  if (metarLookup) registerMetarRoutes(app, metarLookup);
  app.post("/api/route-lookups", async (request, reply) => {
    const enabled = request.body?.enabled;
    if (typeof enabled !== "boolean")
      return reply.code(400).send({ error: "enabled must be a boolean." });
    if (typeof feed.setRouteLookupsEnabled !== "function")
      return reply.code(501).send({ error: "Route lookups are not available." });
    feed.setRouteLookupsEnabled(enabled);
    return { enabled };
  });
  app.get("/ws", { websocket: true }, (socket) => {
    const unsubscribe = feed.subscribe((snapshot) => {
      if (socket.readyState === 1) socket.send(JSON.stringify(snapshot));
    }, socket);
    socket.on("message", (message) => {
      try {
        const request = JSON.parse(message.toString());
        if (request.type === "viewport") feed.setClientRadius?.(socket, request.radiusNm);
      } catch {}
    });
    socket.on("close", unsubscribe);
    socket.on("error", unsubscribe);
  });
}

import { registerAirportRoutes } from "./airport/routes.mjs";
import { registerNavaidRoutes } from "./navaid-routes.mjs";
import { registerAirspaceBoundaryRoutes } from "./airspace-boundary-routes.mjs";
import { registerIlsApproachRoutes } from "./ils/approach/routes.mjs";
import { registerProcedureRoutes } from "./procedure/routes.mjs";
import { registerAirwayRoutes } from "./airway/routes.mjs";
import { registerMetarRoutes } from "./metar/routes.mjs";
import { registerWebSocketRoutes } from "./websocket-routes.mjs";
import { registerRouteLookupControl } from "./routes/route-lookups.mjs";

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
  registerRouteLookupControl(app, feed);
  registerWebSocketRoutes(app, feed);
}

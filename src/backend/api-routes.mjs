import { default as registerAirportRoutes } from "./airport/routes.mjs";
import { default as registerNavaidRoutes } from "./navaid-routes.mjs";
import { default as registerAirspaceBoundaryRoutes } from "./airspace-boundary-routes.mjs";
import { default as registerIlsApproachRoutes } from "./ils/approach/routes.mjs";
import { default as registerProcedureRoutes } from "./procedure/routes.mjs";
import { default as registerAirwayRoutes } from "./airway/routes.mjs";
import { default as registerMetarRoutes } from "./metar/routes.mjs";
import { default as registerWebSocketRoutes } from "./websocket-routes.mjs";
import { default as registerRouteLookupControl } from "./routes/route-lookups.mjs";
import { default as registerCoreRoutes } from "./core-routes.mjs";

function registerApiRoutes(
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
  registerCoreRoutes(app, feed, {
    location,
    elevationFeet,
    defaultRangeNm,
    defaultRotationDegrees,
  });
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
export default registerApiRoutes;

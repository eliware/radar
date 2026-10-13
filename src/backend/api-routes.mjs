import { registerAirportRoutes } from "./airport-routes.mjs";
import { registerNavaidRoutes } from "./navaid-routes.mjs";
import { registerAirspaceBoundaryRoutes } from "./airspace-boundary-routes.mjs";
import { registerIlsApproachRoutes } from "./ils-approach-routes.mjs";

export function registerApiRoutes(
  app,
  feed,
  { location = null, elevationFeet = 300, airportDatabase = null } = {},
) {
  app.get("/health", async () => ({ status: "ok" }));
  app.get("/api/config", async () => ({ location, elevationFeet }));
  app.get("/api/aircraft", async () => feed.list());
  registerAirportRoutes(app, airportDatabase, location);
  registerNavaidRoutes(app, airportDatabase, location);
  registerAirspaceBoundaryRoutes(app, airportDatabase, location);
  registerIlsApproachRoutes(app, airportDatabase, location);
  app.get("/ws", { websocket: true }, (socket) => {
    const unsubscribe = feed.subscribe((aircraft) => {
      if (socket.readyState === 1) socket.send(JSON.stringify(aircraft));
    });
    socket.on("close", unsubscribe);
    socket.on("error", unsubscribe);
  });
}

import websocket from "@fastify/websocket";
import Fastify from "fastify";
import { resolve } from "node:path";
import { registerApiRoutes } from "./api-routes.mjs";
import { registerStaticRoutes } from "./static-routes.mjs";

export async function createRadarServer({
  feed,
  location = null,
  elevationFeet = 300,
  airportDatabase = null,
  metarLookup = null,
  mapOutlines = null,
  fastifyFactory = Fastify,
  websocketPlugin = websocket,
  publicRoot = resolve("public"),
  buildRoot = resolve("dist"),
  read,
}) {
  const app = fastifyFactory({ logger: false });
  await app.register(websocketPlugin);
  registerApiRoutes(app, feed, {
    location,
    elevationFeet,
    airportDatabase,
    metarLookup,
    mapOutlines,
  });
  if (airportDatabase) app.addHook("onClose", async () => airportDatabase.close());
  registerStaticRoutes(app, { publicRoot, buildRoot, read });
  return app;
}

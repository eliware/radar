import websocket from "@fastify/websocket";
import Fastify from "fastify";
import { resolve } from "node:path";
import { default as registerApiRoutes } from "./api-routes.mjs";
import { default as registerStaticRoutes } from "./static-routes.mjs";

async function createRadarServer({
  feed,
  location = null,
  elevationFeet = 300,
  defaultRangeNm = 20,
  defaultRotationDegrees = 0,
  airportDatabase = null,
  metarLookup = null,
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
    defaultRangeNm,
    defaultRotationDegrees,
    airportDatabase,
    metarLookup,
  });
  if (airportDatabase) app.addHook("onClose", async () => airportDatabase.close());
  registerStaticRoutes(app, { publicRoot, buildRoot, read });
  return app;
}
export default createRadarServer;

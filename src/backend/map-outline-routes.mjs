export function registerMapOutlineRoutes(app, mapOutlines) {
  app.get("/api/map-outlines", async () => mapOutlines);
}

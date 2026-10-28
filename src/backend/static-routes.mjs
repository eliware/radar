import { isAllowedAppIcon, isAllowedPwaScreenshot } from "./static/asset/policy.mjs";
import { sendStaticAsset } from "./static/asset/response.mjs";

export function registerStaticRoutes(app, { publicRoot, buildRoot, read }) {
  app.get("/", async (_request, reply) => {
    reply.header("Cache-Control", "no-cache");
    return sendStaticAsset(reply, `${publicRoot}/index.html`, "text/html", read);
  });
  app.get("/style.css", async (_request, reply) => {
    reply.header("Cache-Control", "no-cache");
    return sendStaticAsset(reply, `${publicRoot}/style.css`, "text/css", read);
  });
  app.get("/manifest.webmanifest", async (_request, reply) =>
    sendStaticAsset(reply, `${publicRoot}/manifest.webmanifest`, "application/manifest+json", read),
  );
  app.get("/icons/:filename", async (request, reply) => {
    const { filename } = request.params;
    if (!isAllowedAppIcon(filename)) return reply.code(404).send("Not found");
    return sendStaticAsset(reply, `${publicRoot}/icons/${filename}`, "image/png", read);
  });
  app.get("/screenshots/:filename", async (request, reply) => {
    const { filename } = request.params;
    if (!isAllowedPwaScreenshot(filename)) return reply.code(404).send("Not found");
    return sendStaticAsset(reply, `${publicRoot}/screenshots/${filename}`, "image/png", read);
  });
  app.get("/client.js", async (_request, reply) =>
    sendStaticAsset(reply, `${buildRoot}/client.js`, "text/javascript", read),
  );
  app.get("/chunks/:filename", async (request, reply) => {
    const filename = request.params.filename;
    if (!/^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*\.js$/.test(filename))
      return reply.code(404).send("Not found");
    return sendStaticAsset(reply, `${buildRoot}/chunks/${filename}`, "text/javascript", read);
  });
}

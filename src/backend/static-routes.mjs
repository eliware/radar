import { readFile } from "node:fs/promises";

const appIcons = new Set([
  "radar-180.png",
  "radar-192.png",
  "radar-512.png",
  "radar-maskable-512.png",
]);
const pwaScreenshots = new Set(["radar-desktop.png", "radar-mobile.png"]);
const charsetSeparator = String.fromCharCode(59);

export function registerStaticRoutes(app, { publicRoot, buildRoot, read = readFile }) {
  app.get("/", async (_request, reply) =>
    sendAsset(reply, `${publicRoot}/index.html`, "text/html", read),
  );
  app.get("/style.css", async (_request, reply) =>
    sendAsset(reply, `${publicRoot}/style.css`, "text/css", read),
  );
  app.get("/manifest.webmanifest", async (_request, reply) =>
    sendAsset(reply, `${publicRoot}/manifest.webmanifest`, "application/manifest+json", read),
  );
  app.get("/icons/:filename", async (request, reply) => {
    const { filename } = request.params;
    if (!appIcons.has(filename)) return reply.code(404).send("Not found");
    return sendAsset(reply, `${publicRoot}/icons/${filename}`, "image/png", read);
  });
  app.get("/screenshots/:filename", async (request, reply) => {
    const { filename } = request.params;
    if (!pwaScreenshots.has(filename)) return reply.code(404).send("Not found");
    return sendAsset(reply, `${publicRoot}/screenshots/${filename}`, "image/png", read);
  });
  app.get("/client.js", async (_request, reply) =>
    sendAsset(reply, `${buildRoot}/client.js`, "text/javascript", read),
  );
  app.get("/chunks/:filename", async (request, reply) => {
    const filename = request.params.filename;
    if (!/^[A-Za-z0-9_-]+(?:\.[A-Za-z0-9_-]+)*\.js$/.test(filename))
      return reply.code(404).send("Not found");
    return sendAsset(reply, `${buildRoot}/chunks/${filename}`, "text/javascript", read);
  });
}

async function sendAsset(reply, file, type, read) {
  try {
    return reply.type(`${type}${charsetSeparator} charset=utf-8`).send(await read(file));
  } catch {
    return reply.code(404).type(`text/plain${charsetSeparator} charset=utf-8`).send("Not found");
  }
}

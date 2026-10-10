import { readFile } from "node:fs/promises";

export function registerStaticRoutes(app, { publicRoot, buildRoot, read = readFile }) {
  app.get("/", async (_request, reply) =>
    sendAsset(reply, `${publicRoot}/index.html`, "text/html", read),
  );
  app.get("/style.css", async (_request, reply) =>
    sendAsset(reply, `${publicRoot}/style.css`, "text/css", read),
  );
  app.get("/client.js", async (_request, reply) =>
    sendAsset(reply, `${buildRoot}/client.js`, "text/javascript", read),
  );
}

async function sendAsset(reply, file, type, read) {
  try {
    return reply.type(`${type}; charset=utf-8`).send(await read(file));
  } catch {
    return reply.code(404).type("text/plain; charset=utf-8").send("Not found");
  }
}

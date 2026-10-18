import { expect, jest, test } from "@jest/globals";
import Fastify from "fastify";
import { registerStaticRoutes } from "../../src/backend/static-routes.mjs";

test("serves the page and browser bundle", async () => {
  const app = Fastify();
  const read = jest.fn(async (file) => file);
  registerStaticRoutes(app, { publicRoot: "public", buildRoot: "dist", read });
  const page = await app.inject({ url: "/" });
  const style = await app.inject({ url: "/style.css" });
  const manifest = await app.inject({ url: "/manifest.webmanifest" });
  const icon = await app.inject({ url: "/icons/radar-192.png" });
  const screenshot = await app.inject({ url: "/screenshots/radar-desktop.png" });
  const script = await app.inject({ url: "/client.js" });
  expect(page.statusCode).toBe(200);
  expect(page.headers["content-type"]).toContain("text/html");
  expect(page.headers["cache-control"]).toBe("no-cache");
  expect(style.statusCode).toBe(200);
  expect(style.headers["content-type"]).toContain("text/css");
  expect(style.headers["cache-control"]).toBe("no-cache");
  expect(manifest.statusCode).toBe(200);
  expect(manifest.headers["content-type"]).toContain("application/manifest+json");
  expect(icon.statusCode).toBe(200);
  expect(icon.headers["content-type"]).toContain("image/png");
  expect(screenshot.statusCode).toBe(200);
  expect(screenshot.headers["content-type"]).toContain("image/png");
  expect(script.statusCode).toBe(200);
  expect(script.headers["content-type"]).toContain("text/javascript");
  expect(read).toHaveBeenNthCalledWith(1, "public/index.html");
  expect(read).toHaveBeenNthCalledWith(2, "public/style.css");
  expect(read).toHaveBeenNthCalledWith(3, "public/manifest.webmanifest");
  expect(read).toHaveBeenNthCalledWith(4, "public/icons/radar-192.png");
  expect(read).toHaveBeenNthCalledWith(5, "public/screenshots/radar-desktop.png");
  await app.close();
});

test("returns not found when a local asset does not exist", async () => {
  const app = Fastify();
  registerStaticRoutes(app, {
    publicRoot: "public",
    buildRoot: "dist",
    read: () => Promise.reject(new Error("missing")),
  });
  const response = await app.inject({ url: "/client.js" });
  expect(response.statusCode).toBe(404);
  expect(response.body).toBe("Not found");
  await app.close();
});

test("serves safe JavaScript chunks and rejects invalid chunk names", async () => {
  const app = Fastify();
  const read = jest.fn(async (file) => file);
  registerStaticRoutes(app, { publicRoot: "public", buildRoot: "dist", read });
  const chunk = await app.inject({ url: "/chunks/vendor-1.js" });
  const hashedChunk = await app.inject({ url: "/chunks/510.b677546a14dfc2a612af.js" });
  const invalid = await app.inject({ url: "/chunks/secret.css" });
  expect(chunk.statusCode).toBe(200);
  expect(hashedChunk.statusCode).toBe(200);
  expect(chunk.headers["content-type"]).toContain("text/javascript");
  expect(read).toHaveBeenCalledWith("dist/chunks/vendor-1.js");
  expect(read).toHaveBeenCalledWith("dist/chunks/510.b677546a14dfc2a612af.js");
  expect(invalid.statusCode).toBe(404);
  await app.close();
});

test("serves known PWA icons and rejects unknown icon names", async () => {
  const app = Fastify();
  const read = jest.fn(async (file) => file);
  registerStaticRoutes(app, { publicRoot: "public", buildRoot: "dist", read });
  const icon = await app.inject({ url: "/icons/radar-180.png" });
  const maskable = await app.inject({ url: "/icons/radar-maskable-512.png" });
  const invalid = await app.inject({ url: "/icons/other.png" });
  expect(icon.statusCode).toBe(200);
  expect(maskable.statusCode).toBe(200);
  expect(read).toHaveBeenCalledWith("public/icons/radar-180.png");
  expect(read).toHaveBeenCalledWith("public/icons/radar-maskable-512.png");
  expect(invalid.statusCode).toBe(404);
  await app.close();
});

test("returns not found when a requested chunk does not exist", async () => {
  const app = Fastify();
  registerStaticRoutes(app, {
    publicRoot: "public",
    buildRoot: "dist",
    read: () => Promise.reject(new Error("missing")),
  });
  const response = await app.inject({ url: "/chunks/missing.js" });
  expect(response.statusCode).toBe(404);
  expect(response.body).toBe("Not found");
  await app.close();
});

test("rejects unknown PWA screenshot names", async () => {
  const app = Fastify();
  registerStaticRoutes(app, { publicRoot: "public", buildRoot: "dist" });
  const response = await app.inject({ url: "/screenshots/private.png" });
  expect(response.statusCode).toBe(404);
  await app.close();
});

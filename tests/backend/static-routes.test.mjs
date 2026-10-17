import { expect, jest, test } from "@jest/globals";
import { readFile as readText } from "node:fs/promises";
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
  expect(style.statusCode).toBe(200);
  expect(style.headers["content-type"]).toContain("text/css");
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

test("configures Radar as a standalone portrait Home Screen app without offline caching", async () => {
  const root = new URL("../../", import.meta.url);
  const manifest = JSON.parse(await readText(new URL("public/manifest.webmanifest", root), "utf8"));
  const page = await readText(new URL("public/index.html", root), "utf8");
  expect(manifest.name).toBe("Eliware Radar");
  expect(manifest.display).toBe("standalone");
  expect(manifest.orientation).toBe("portrait");
  expect(manifest.id).toBe("/");
  expect(manifest.icons.map(({ purpose }) => purpose)).toEqual(["any", "any", "maskable"]);
  expect(manifest.screenshots.map(({ form_factor }) => form_factor)).toEqual(["wide", "narrow"]);
  expect(manifest.screenshots.map(({ sizes }) => sizes)).toEqual(["1280x1024", "1170x2532"]);
  expect(manifest.screenshots.every(({ type }) => type === "image/png")).toBe(true);
  expect(page).toContain('name="apple-mobile-web-app-capable" content="yes"');
  expect(page).toContain('rel="apple-touch-icon" href="/icons/radar-180.png"');
  expect(page).toContain('rel="manifest" href="/manifest.webmanifest"');
  expect(page).not.toContain("serviceWorker.register");
});

test("rejects unknown PWA screenshot names", async () => {
  const app = Fastify();
  registerStaticRoutes(app, { publicRoot: "public", buildRoot: "dist" });
  const response = await app.inject({ url: "/screenshots/private.png" });
  expect(response.statusCode).toBe(404);
  await app.close();
});

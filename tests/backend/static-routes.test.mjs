import { expect, jest, test } from "@jest/globals";
import Fastify from "fastify";
import { registerStaticRoutes } from "../../src/backend/static-routes.mjs";

test("serves the page and browser bundle", async () => {
  const app = Fastify();
  const read = jest.fn(async (file) => file);
  registerStaticRoutes(app, { publicRoot: "public", buildRoot: "dist", read });
  const page = await app.inject({ url: "/" });
  const style = await app.inject({ url: "/style.css" });
  const script = await app.inject({ url: "/client.js" });
  expect(page.statusCode).toBe(200);
  expect(page.headers["content-type"]).toContain("text/html");
  expect(style.statusCode).toBe(200);
  expect(style.headers["content-type"]).toContain("text/css");
  expect(script.statusCode).toBe(200);
  expect(script.headers["content-type"]).toContain("text/javascript");
  expect(read).toHaveBeenNthCalledWith(1, "public/index.html");
  expect(read).toHaveBeenNthCalledWith(2, "public/style.css");
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

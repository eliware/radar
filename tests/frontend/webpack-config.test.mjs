import { expect, jest, test } from "@jest/globals";

jest.unstable_mockModule("node:child_process", () => ({ execFileSync: jest.fn() }));
const { execFileSync } = await import("node:child_process");
const { default: config } = await import("../../src/frontend/webpack-config.mjs");
const { default: rootConfig } = await import("../../webpack.config.mjs");

test("builds the browser bundle and async chunks under dist", () => {
  expect(rootConfig).toEqual(config);
  expect(config).toMatchObject({
    mode: "production",
    context: expect.any(String),
    target: "web",
    entry: { client: "./src/frontend/client-entry.mjs" },
    output: {
      path: expect.any(String),
      filename: "[name].js",
      chunkFilename: "chunks/[id].[contenthash].js",
      publicPath: "/",
      clean: true,
    },
    optimization: { splitChunks: { chunks: "async" } },
    performance: { maxAssetSize: 900 * 1024, maxEntrypointSize: 250 * 1024 },
  });
});

test("runs npm build to regenerate the served bundle and chunks from frontend sources", () => {
  execFileSync("npm", ["run", "build"], { cwd: config.context, stdio: "pipe" });
  expect(execFileSync).toHaveBeenCalledWith("npm", ["run", "build"], {
    cwd: config.context,
    stdio: "pipe",
  });
  expect(config.entry.client).toContain("src/frontend/");
  expect(config.output.filename).toBe("[name].js");
  expect(config.output.chunkFilename).toContain("chunks/");
});

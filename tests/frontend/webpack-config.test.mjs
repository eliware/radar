import { expect, test } from "@jest/globals";
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

import { expect, test } from "@jest/globals";
import config from "../../src/frontend/webpack-config.mjs";

test("builds the browser bundle and async chunks under dist", () => {
  expect(config).toMatchObject({
    mode: "production",
    entry: "./src/frontend/client-entry.mjs",
    output: {
      path: expect.any(String),
      filename: "client.js",
      chunkFilename: "chunks/[id].[contenthash].js",
      publicPath: "/",
    },
    optimization: { splitChunks: { chunks: "async" } },
    performance: { maxAssetSize: 900 * 1024, maxEntrypointSize: 250 * 1024 },
  });
});

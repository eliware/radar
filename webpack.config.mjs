import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));

export default {
  context: root,
  mode: "production",
  target: "web",
  entry: { client: "./src/frontend/client-entry.mjs" },
  output: {
    path: resolve(root, "dist"),
    filename: "[name].js",
    chunkFilename: "chunks/[id].[contenthash].js",
    publicPath: "/",
    clean: true,
  },
  optimization: { splitChunks: { chunks: "async" } },
  performance: { maxAssetSize: 900 * 1024, maxEntrypointSize: 250 * 1024 },
};

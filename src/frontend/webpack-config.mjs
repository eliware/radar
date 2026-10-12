import { resolve } from "node:path";

export default {
  mode: "production",
  entry: "./src/frontend/client-entry.mjs",
  output: {
    path: resolve("dist"),
    filename: "client.js",
    chunkFilename: "chunks/[name].js",
    publicPath: "/",
  },
  optimization: { splitChunks: { chunks: "all" } },
  performance: { maxAssetSize: 900 * 1024, maxEntrypointSize: 250 * 1024 },
};

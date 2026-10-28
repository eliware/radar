import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { resolve } from "node:path";
import { default as config } from "./webpack-config.mjs";

export function buildFrontend(run = execFileSync) {
  run(
    process.execPath,
    [
      resolve(config.context, "node_modules/webpack-cli/bin/cli.js"),
      "--config",
      "webpack.config.mjs",
    ],
    { cwd: config.context, stdio: "pipe" },
  );
  const chunksPath = `${config.output.path}/chunks`;
  return {
    bundleExists: existsSync(`${config.output.path}/client.js`),
    chunksExist: existsSync(chunksPath),
    asyncChunkExists:
      existsSync(chunksPath) && readdirSync(chunksPath).some((file) => file.endsWith(".js")),
  };
}

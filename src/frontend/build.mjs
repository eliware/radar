import { execFileSync } from "node:child_process";
import { existsSync, readdirSync } from "node:fs";
import { default as config } from "./webpack-config.mjs";

export function buildFrontend(run = execFileSync) {
  run("npm", ["run", "build"], { cwd: config.context, stdio: "pipe" });
  const chunksPath = `${config.output.path}/chunks`;
  return {
    bundleExists: existsSync(`${config.output.path}/client.js`),
    chunksExist: existsSync(chunksPath),
    asyncChunkExists:
      existsSync(chunksPath) && readdirSync(chunksPath).some((file) => file.endsWith(".js")),
  };
}

import { parseScreenshotArguments as parseArguments } from "./selection/arguments.mjs";

export function parseScreenshotArguments(args = []) {
  return parseArguments(args);
}

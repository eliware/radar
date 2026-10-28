import { parseAdsbArguments } from "./arguments.mjs";
import { resolveAdsbSettings } from "./settings.mjs";

export function parseAdsbOptions(args) {
  return resolveAdsbSettings(parseAdsbArguments(args));
}

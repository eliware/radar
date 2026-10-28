import { parseAdsbArguments } from "./arguments.mjs";
import { resolveAdsbSettings } from "./settings.mjs";

export function parseAdsbOptions(args, environment) {
  return resolveAdsbSettings(parseAdsbArguments(args), environment);
}

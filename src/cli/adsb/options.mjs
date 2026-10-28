import { readAdsbEnvironment } from "./environment.mjs";
import { parseAdsbArguments, validateAdsbPort } from "./arguments.mjs";

export function parseAdsbOptions(args) {
  const options = { ...readAdsbEnvironment(), ...parseAdsbArguments(args) };
  validateAdsbPort(options.port);
  return options;
}

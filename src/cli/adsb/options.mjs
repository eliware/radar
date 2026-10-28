import { readAdsbEnvironment } from "./environment.mjs";
import { parseAdsbArguments } from "./arguments.mjs";
import { validateAdsbPort } from "./port.mjs";

export function parseAdsbOptions(args) {
  const options = { ...readAdsbEnvironment(), ...parseAdsbArguments(args) };
  validateAdsbPort(options.port);
  return options;
}

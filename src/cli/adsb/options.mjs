import { readAdsbEnvironment } from "./environment.mjs";
import { parseAdsbArguments } from "./arguments.mjs";
import { validateAdsbPort } from "./port.mjs";

export function parseAdsbOptions(args) {
  const parsedArguments = parseAdsbArguments(args);
  const options = { ...readAdsbEnvironment(), ...parsedArguments };
  validateAdsbPort(options.port);
  return options;
}

import { readAdsbEnvironment } from "./environment.mjs";
import { parseAdsbArguments } from "./arguments.mjs";
import { parseAdsbPort, validateAdsbPort } from "./port.mjs";

export function parseAdsbOptions(args) {
  const parsedArguments = parseAdsbArguments(args);
  if (parsedArguments.port !== undefined)
    parsedArguments.port = parseAdsbPort(parsedArguments.port);
  const options = { ...readAdsbEnvironment(), ...parsedArguments };
  validateAdsbPort(options.port);
  return options;
}

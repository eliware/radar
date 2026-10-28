import { readAdsbEnvironment } from "./environment.mjs";
import { parseAdsbArguments } from "./arguments.mjs";
import { resolveAdsbPort } from "./port.mjs";

export function parseAdsbOptions(args) {
  const parsedArguments = parseAdsbArguments(args);
  const environment = readAdsbEnvironment();
  return {
    ...environment,
    ...parsedArguments,
    port: resolveAdsbPort(parsedArguments.port, environment.port),
  };
}

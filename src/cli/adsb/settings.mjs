import { readAdsbEnvironment } from "./environment.mjs";
import { resolveAdsbPort } from "./port.mjs";

export function resolveAdsbSettings(parsedArguments, environment = readAdsbEnvironment()) {
  return {
    ...environment,
    ...parsedArguments,
    port: resolveAdsbPort(parsedArguments.port, environment.port),
  };
}

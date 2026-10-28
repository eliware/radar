import { readAdsbEnvironment } from "./read-environment.mjs";
import { resolveAdsbPort } from "./resolve-port.mjs";

export function resolveAdsbSettings(parsedArguments, environment = readAdsbEnvironment()) {
  return {
    ...environment,
    ...parsedArguments,
    port: resolveAdsbPort(parsedArguments.port, environment.port),
  };
}

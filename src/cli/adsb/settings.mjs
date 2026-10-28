import { readAdsbEnvironment } from "./environment.mjs";
import { resolveAdsbSettingsPort } from "./port.mjs";

export function resolveAdsbSettings(parsedArguments, environment = readAdsbEnvironment()) {
  return {
    ...environment,
    ...parsedArguments,
    port: resolveAdsbSettingsPort(parsedArguments, environment),
  };
}

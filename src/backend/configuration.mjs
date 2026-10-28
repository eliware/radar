import { resolveWebNetworkConfiguration } from "./config/web.mjs";
import { resolveWebServiceConfiguration } from "./config/services.mjs";

export function resolveWebConfiguration(environment, { parseAdsbLocation, parseMetarStations }) {
  return {
    ...resolveWebNetworkConfiguration(environment, parseAdsbLocation),
    ...resolveWebServiceConfiguration(environment, parseMetarStations),
  };
}

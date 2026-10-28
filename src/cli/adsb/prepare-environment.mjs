import { loadAdsbEnvironment } from "./load-environment.mjs";
import { readAdsbEnvironment } from "./read-environment.mjs";

export function prepareAdsbEnvironment({
  loadEnvironment = loadAdsbEnvironment,
  environment = process.env,
} = {}) {
  loadEnvironment();
  return readAdsbEnvironment(environment);
}

import { prepareAdsbEnvironment } from "./prepare-environment.mjs";
import { createAdsbCliBootstrapOptions } from "./bootstrap-options.mjs";

export function createAdsbCliSetup({
  args = process.argv.slice(2),
  stdout = process.stdout,
  processRef = process,
  environment = process.env,
  prepareEnvironment = prepareAdsbEnvironment,
  createBootstrap,
} = {}) {
  const environmentSettings = prepareEnvironment({ environment });
  const { bootstrap, cliOptions } = createAdsbCliBootstrapOptions({
    args,
    stdout,
    processRef,
    environment,
    environmentSettings,
    createBootstrap,
  });
  return {
    cliOptions,
    install: bootstrap.install,
  };
}

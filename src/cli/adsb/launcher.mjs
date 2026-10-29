import { startAdsbCli } from "./cli.mjs";
import { createAdsbCliSetup } from "./setup.mjs";

export function launchAdsbCli(options = {}) {
  const setup = createAdsbCliSetup(options);
  const cli = (options.startCli ?? startAdsbCli)(setup.cliOptions);
  return { cli, close: setup.install(cli) };
}

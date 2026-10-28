import { createAdsbUpdateWriter } from "./write-update.mjs";

export function createAdsbCliOutput({
  debug,
  write,
  renderTable,
  createUpdateWriter = createAdsbUpdateWriter,
}) {
  let hasAircraft = false;
  const outputWriter = createUpdateWriter({ debug, write, renderTable });
  function refresh() {
    if (!hasAircraft) return;
    outputWriter.refresh();
  }
  return {
    table: outputWriter.table,
    refresh,
    update(aircraft) {
      hasAircraft = true;
      outputWriter.update(aircraft);
    },
  };
}

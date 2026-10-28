import { writeAdsbUpdate } from "./write-update.mjs";

export function createAdsbCliOutput({ debug, write, renderTable }) {
  let hasAircraft = false;
  function refresh() {
    if (!hasAircraft || debug) return;
    writeAdsbUpdate({ debug: false, write, renderTable });
  }
  return {
    table: !debug,
    refresh,
    update(aircraft) {
      if (debug) {
        writeAdsbUpdate({ aircraft, debug: true, write, renderTable });
        return;
      }
      hasAircraft = true;
      refresh();
    },
  };
}

export function createAdsbUpdateWriter({ debug, write, renderTable }) {
  return {
    table: !debug,
    update(aircraft) {
      write(debug ? JSON.stringify(aircraft) : renderTable());
    },
    refresh() {
      if (!debug) write(renderTable());
    },
  };
}

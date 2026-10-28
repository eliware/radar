export function writeAdsbUpdate({ aircraft, debug, write, renderTable }) {
  write(debug ? JSON.stringify(aircraft) : renderTable());
}

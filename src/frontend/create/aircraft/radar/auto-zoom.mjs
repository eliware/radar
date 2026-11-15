export function createAircraftRadarAutoZoom() {
  let enabled = true;
  return {
    disable: () => (enabled = false),
    setEnabled: (value) => (enabled = value),
    isEnabled: () => enabled,
  };
}

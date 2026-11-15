export function disposeRadarLayerVisibility({ ils, procedures, aircraft, detachShortcuts }) {
  ils.destroy();
  procedures.destroy();
  detachShortcuts();
  aircraft.destroy();
}

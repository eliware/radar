export function destroyDashboardResources(resources) {
  resources.detachFlightStripsToggle?.();
  resources.detachMetarDisplayToggle?.();
  resources.detachCompass?.();
  resources.detachMobileCompass?.();
  resources.detachReset?.();
  resources.detachArrowControls?.();
  resources.detachReferences?.();
  resources.metarRefresh?.destroy();
  resources.feed?.close();
  resources.flightStrips?.destroy();
  resources.scene?.destroy?.();
}

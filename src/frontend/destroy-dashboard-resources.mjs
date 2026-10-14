export function destroyDashboardResources(resources) {
  resources.detachCompass?.();
  resources.detachReset?.();
  resources.detachArrowControls?.();
  resources.detachReferences?.();
  if (resources.metarTimer !== null && resources.metarTimer !== undefined) {
    resources.windowRef?.clearInterval?.(resources.metarTimer);
  }
  resources.feed?.close();
  resources.flightStrips?.destroy();
  resources.scene?.destroy?.();
}

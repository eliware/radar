export function destroyDashboardResources(resources) {
  resources.detachCompass?.();
  resources.detachReferences?.();
  resources.reset?.removeEventListener?.("click", resources.resetView);
  if (resources.metarTimer !== null && resources.metarTimer !== undefined) {
    resources.windowRef?.clearInterval?.(resources.metarTimer);
  }
  resources.feed?.close();
  resources.flightStrips?.destroy();
  resources.scene?.destroy?.();
}

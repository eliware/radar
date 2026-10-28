export function scheduleFlightStripRefresh(windowRef, refresh) {
  windowRef?.addEventListener?.("resize", refresh);
  const timer = windowRef?.setInterval?.(refresh, 500);
  return () => {
    windowRef?.removeEventListener?.("resize", refresh);
    if (timer !== undefined) windowRef?.clearInterval?.(timer);
  };
}

export function attachDashboardPagehide(windowRef, cleanup) {
  let closed = false;
  const close = () => {
    if (closed) return;
    closed = true;
    windowRef?.removeEventListener?.("pagehide", close);
    cleanup();
  };
  windowRef?.addEventListener?.("pagehide", close, { once: true });
  return close;
}

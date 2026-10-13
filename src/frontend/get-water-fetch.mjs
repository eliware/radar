export function getWaterFetch(windowRef) {
  if (typeof windowRef?.fetch === "function") return windowRef.fetch.bind(windowRef);
  return async () => ({ ok: false });
}

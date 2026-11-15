export function attachRadarLegendRedraw(documentRef, redraw) {
  if (!documentRef?.addEventListener) return () => {};
  const onKeyDown = (event) => {
    if (["m", "f"].includes(event.key?.toLowerCase())) redraw?.();
  };
  documentRef.addEventListener("keydown", onKeyDown);
  return () => documentRef.removeEventListener?.("keydown", onKeyDown);
}

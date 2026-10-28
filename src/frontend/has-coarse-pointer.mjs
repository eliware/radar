export function hasCoarsePointer(windowRef) {
  return Boolean(windowRef.matchMedia?.("(pointer: coarse)")?.matches);
}

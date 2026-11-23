function hasCoarsePointer(windowRef) {
  return Boolean(windowRef.matchMedia?.("(pointer: coarse)")?.matches);
}
export default hasCoarsePointer;

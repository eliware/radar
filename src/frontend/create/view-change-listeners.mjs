export function createViewChangeListeners() {
  const listeners = new Set();
  return {
    emit(range) {
      for (const listener of listeners) listener(range);
    },
    subscribe(listener) {
      listeners.add(listener);
      listener();
      return () => listeners.delete(listener);
    },
    clear() {
      listeners.clear();
    },
  };
}

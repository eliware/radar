import { createWebSocketRetry } from "./retry.mjs";

export function createWebSocketReconnection({ setTimer, clearTimer, onReconnect, onState }) {
  let retryPending = false;
  const retry = createWebSocketRetry({
    setTimer,
    clearTimer,
    onRetry() {
      retryPending = false;
      onReconnect();
    },
  });

  return {
    get pending() {
      return retryPending;
    },
    canHandle(source, activeSocket, stopped) {
      return !stopped && !retryPending && source === activeSocket;
    },
    schedule(source, activeSocket, stopped) {
      if (stopped || (source && source !== activeSocket) || retryPending) return;
      retryPending = true;
      onState(false);
      if (source) source.onopen = source.onmessage = source.onerror = source.onclose = null;
      retry.schedule();
    },
    reset() {
      retry.reset();
    },
    cancel() {
      retryPending = false;
      retry.cancel();
    },
  };
}

import { createWebSocketRetry } from "./retry.mjs";
import { createSocketConnection } from "./socket-connection.mjs";

export function connectWebSocketFeed({
  WebSocketClass,
  url,
  onMessage,
  onState,
  onOpen = () => {},
  setTimer = setTimeout,
  clearTimer = clearTimeout,
}) {
  let socket;
  let stopped = false;
  let retryPending = false;
  const retry = createWebSocketRetry({
    setTimer,
    clearTimer,
    onRetry: () => {
      retryPending = false;
      connect();
    },
  });

  function connect() {
    retryPending = false;
    socket = createSocketConnection(WebSocketClass, url);
    if (!socket) {
      scheduleRetry();
      return;
    }
    const current = socket;
    current.onopen = async () => {
      if (stopped || retryPending || current !== socket) return;
      retry.reset();
      onState(true);
      await onOpen(current);
    };
    current.onmessage = (event) => {
      if (!stopped && !retryPending && current === socket) onMessage(event.data);
    };
    current.onerror = () => scheduleRetry(current);
    current.onclose = () => scheduleRetry(current);
  }

  function scheduleRetry(source) {
    if (stopped || (source && source !== socket) || retryPending) return;
    retryPending = true;
    onState(false);
    if (source) source.onopen = source.onmessage = source.onerror = source.onclose = null;
    retry.schedule();
  }

  connect();
  return {
    get socket() {
      return socket;
    },
    close() {
      if (stopped) return;
      stopped = true;
      retry.cancel();
      const active = socket;
      if (active) {
        active.onopen = active.onmessage = active.onerror = active.onclose = null;
        active.close?.();
      }
      onState(false);
    },
  };
}

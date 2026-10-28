import { createWebSocketReconnection } from "./reconnection.mjs";
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
  const reconnection = createWebSocketReconnection({
    setTimer,
    clearTimer,
    onReconnect: connect,
    onState,
  });

  function connect() {
    socket = createSocketConnection(WebSocketClass, url);
    if (!socket) {
      reconnection.schedule(undefined, socket, stopped);
      return;
    }
    const current = socket;
    current.onopen = async () => {
      if (!reconnection.canHandle(current, socket, stopped)) return;
      reconnection.reset();
      onState(true);
      await onOpen(current);
    };
    current.onmessage = (event) => {
      if (reconnection.canHandle(current, socket, stopped)) onMessage(event.data);
    };
    current.onerror = () => reconnection.schedule(current, socket, stopped);
    current.onclose = () => reconnection.schedule(current, socket, stopped);
  }

  connect();
  return {
    get socket() {
      return socket;
    },
    close() {
      if (stopped) return;
      stopped = true;
      reconnection.cancel();
      const active = socket;
      if (active) {
        active.onopen = active.onmessage = active.onerror = active.onclose = null;
        active.close?.();
      }
      onState(false);
    },
  };
}

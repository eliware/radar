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
  let retryTimer;
  let retryDelay = 1000;
  let stopped = false;
  let retryPending = false;

  function connect() {
    if (stopped) return;
    retryPending = false;
    try {
      socket = new WebSocketClass(url);
    } catch {
      scheduleRetry();
      return;
    }
    const current = socket;
    current.onopen = async () => {
      if (stopped || retryPending || current !== socket) return;
      retryDelay = 1000;
      onState(true);
      await onOpen();
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
    const delay = retryDelay;
    retryDelay = Math.min(retryDelay * 2, 30000);
    retryTimer = setTimer(() => {
      retryTimer = undefined;
      connect();
    }, delay);
  }

  connect();
  return {
    get socket() {
      return socket;
    },
    close() {
      if (stopped) return;
      stopped = true;
      if (retryTimer !== undefined) clearTimer(retryTimer);
      const active = socket;
      if (active) {
        active.onopen = active.onmessage = active.onerror = active.onclose = null;
        active.close?.();
      }
      onState(false);
    },
  };
}

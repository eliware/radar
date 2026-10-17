import { createConnection } from "node:net";
import { createInterface } from "node:readline";

export function connectSbsFeed({
  host,
  port,
  onLine,
  onError,
  connectionFactory = createConnection,
  lineReaderFactory = createInterface,
  timerFactory = setTimeout,
  clearTimer = clearTimeout,
  retryDelayMs = 2000,
}) {
  let activeConnection;
  let retryTimer;
  let closed = false;
  let connected = false;

  function connect() {
    if (closed) return;
    const socket = connectionFactory({ host, port });
    const reader = lineReaderFactory({ input: socket });
    const connection = { socket, reader, retryScheduled: false };
    activeConnection = connection;

    function retry(error) {
      if (closed || connection.retryScheduled) return;
      connection.retryScheduled = true;
      connected = false;
      activeConnection = undefined;
      onError(error);
      reader.close();
      socket.destroy();
      retryTimer = timerFactory(() => {
        retryTimer = undefined;
        connect();
      }, retryDelayMs);
    }

    reader.on("line", onLine);
    reader.on("error", retry);
    socket.on("connect", () => {
      connected = true;
    });
    socket.on("error", retry);
    socket.on("close", () => retry(new Error("SBS data connection closed")));
  }

  connect();
  return {
    close() {
      if (closed) return;
      closed = true;
      connected = false;
      if (retryTimer !== undefined) clearTimer(retryTimer);
      const connection = activeConnection;
      activeConnection = undefined;
      if (!connection) return;
      connection.reader.close();
      connection.socket.destroy();
    },
    isConnected: () => connected,
  };
}

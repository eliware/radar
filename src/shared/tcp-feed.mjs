import { createConnection } from "node:net";
import { createInterface } from "node:readline";

function connectSbsFeed({
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

  function scheduleRetry(error, connection, cleanup) {
    if (closed || connection?.retryScheduled) return;
    if (connection) connection.retryScheduled = true;
    connected = false;
    activeConnection = undefined;
    onError(error);
    cleanup();
    retryTimer = timerFactory(() => {
      retryTimer = undefined;
      connect();
    }, retryDelayMs);
  }

  function connect() {
    if (closed) return;
    let socket;
    let reader;
    try {
      socket = connectionFactory({ host, port });
      reader = lineReaderFactory({ input: socket });
    } catch (error) {
      scheduleRetry(error, undefined, () => socket?.destroy());
      return;
    }
    const connection = { socket, reader, retryScheduled: false };
    activeConnection = connection;

    function retry(error) {
      scheduleRetry(error, connection, () => {
        reader.close();
        socket.destroy();
      });
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
export default connectSbsFeed;

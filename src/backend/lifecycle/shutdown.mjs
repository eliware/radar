export function registerApplicationShutdown({ app, resources, log, registerSignals }) {
  let shutdownPromise;
  const shutdown = () => {
    if (shutdownPromise) return shutdownPromise;
    resources.forEach((resource) => resource?.close());
    shutdownPromise = app.close().then(() => log.info("Web application stopped"));
    return shutdownPromise;
  };
  registerSignals({ log, shutdownHook: shutdown });
  return shutdown;
}

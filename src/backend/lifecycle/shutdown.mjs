export function registerApplicationShutdown({ app, resources, log, registerSignals }) {
  let shutdownPromise;
  const shutdown = () => {
    if (shutdownPromise) return shutdownPromise;
    shutdownPromise = (async () => {
      let failure;
      for (const resource of resources) {
        try {
          await resource?.close();
        } catch (error) {
          failure ??= error;
        }
      }
      try {
        await app.close();
      } catch (error) {
        failure ??= error;
      }
      if (failure) throw failure;
      log.info("Web application stopped");
    })();
    return shutdownPromise;
  };
  registerSignals({ log, shutdownHook: shutdown });
  return shutdown;
}

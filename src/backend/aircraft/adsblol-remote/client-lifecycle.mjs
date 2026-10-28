export function createAdsbLolClientLifecycle({
  clients,
  pollingPolicy,
  poller,
  aircraft,
  publish,
}) {
  function clearRemoteAircraft() {
    poller.stop();
    aircraft.clear();
    publish();
  }

  return {
    connect(key) {
      clients.connect(key);
      poller.start();
    },
    setRadius(key, value) {
      clients.setRadius(key, value);
    },
    setLocalOnly(key, value) {
      if (!clients.setLocalOnly(key, value)) return;
      if (pollingPolicy().hasRemoteClients) poller.start();
      else clearRemoteAircraft();
    },
    disconnect(key) {
      clients.disconnect(key);
      if (!clients.size || !pollingPolicy().hasRemoteClients) clearRemoteAircraft();
    },
    close() {
      poller.close();
      clients.clear();
      aircraft.clear();
    },
  };
}

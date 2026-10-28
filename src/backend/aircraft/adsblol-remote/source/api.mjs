export function createAdsbLolRemoteSourceApi({ aircraft, subscribers }) {
  const publish = () => subscribers.publish();
  return {
    publish,
    createPublicApi(clientLifecycle) {
      return {
        list: aircraft.list,
        subscribe: subscribers.subscribe,
        connectClient: clientLifecycle.connect,
        setClientRadius: clientLifecycle.setRadius,
        setClientLocalOnly: clientLifecycle.setLocalOnly,
        disconnectClient: clientLifecycle.disconnect,
        setRouteLookupsEnabled(value) {
          aircraft.setRouteLookupsEnabled(value);
        },
        close() {
          clientLifecycle.close();
          subscribers.clear();
        },
      };
    },
  };
}

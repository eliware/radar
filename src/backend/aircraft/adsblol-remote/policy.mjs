export function getAdsbLolPollingPolicy(clients, maximumRangeNm) {
  const remoteClients = clients.settings().filter((client) => !client.localOnly);
  return {
    hasRemoteClients: remoteClients.length > 0,
    radiusNm: Math.min(
      maximumRangeNm,
      Math.max(0, ...remoteClients.map((client) => client.radiusNm)),
    ),
  };
}

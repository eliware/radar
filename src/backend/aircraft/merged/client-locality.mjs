export function setMergedClientLocalOnly(clients, remoteSource, key, value, publishSnapshots) {
  if (!clients.setLocalOnly(key, value)) return false;
  remoteSource.setClientLocalOnly?.(key, value);
  publishSnapshots();
  return true;
}

function createRadarConnectionState(onChange) {
  let connected = false;
  return {
    isConnected: () => connected,
    setConnected(value) {
      connected = Boolean(value);
      onChange(connected);
    },
  };
}
export default createRadarConnectionState;

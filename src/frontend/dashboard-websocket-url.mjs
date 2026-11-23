function dashboardWebSocketUrl(location) {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${location.host}/ws`;
}
export default dashboardWebSocketUrl;

export function parseDashboardFeedMessage(data) {
  let message;
  try {
    message = JSON.parse(data);
  } catch {
    return null;
  }
  return message?.event === "aircraft-snapshot" ? message : null;
}

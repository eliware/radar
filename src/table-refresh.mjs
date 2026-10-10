export function startTableRefresh(refresh, schedule, cancel) {
  const timer = schedule(refresh, 1000);
  return () => cancel(timer);
}

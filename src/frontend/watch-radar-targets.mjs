export function watchRadarTargets({ targets, windowRef, onExpire, onTick = () => undefined }) {
  const timer = windowRef.setInterval(() => {
    const expired = targets.prune();
    if (expired.length) onExpire(expired);
    onTick();
  }, 1000);
  return () => windowRef.clearInterval(timer);
}

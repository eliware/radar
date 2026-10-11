export function watchRadarTargets({ targets, windowRef, onExpire }) {
  const timer = windowRef.setInterval(() => {
    const expired = targets.prune();
    if (expired.length) onExpire(expired);
  }, 1000);
  return () => windowRef.clearInterval(timer);
}

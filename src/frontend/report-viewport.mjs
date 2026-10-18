export function createViewportReporter(scene) {
  let lastReportedRadius;
  return (socket, force = false) => {
    const radius = scene.visibleRadiusNm?.() ?? scene.range?.();
    if (socket?.readyState !== 1 || !Number.isFinite(radius)) return;
    const radiusNm = Math.min(300, Math.max(1, Math.ceil(radius)));
    if (!force && radiusNm === lastReportedRadius) return;
    lastReportedRadius = radiusNm;
    socket.send(JSON.stringify({ type: "viewport", radiusNm }));
  };
}

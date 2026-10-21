export function createViewportReporter(scene, documentRef) {
  let lastReportedRadius;
  let lastSocket;
  const send = (socket, force = false) => {
    const radius = scene.visibleRadiusNm?.() ?? scene.range?.();
    if (socket?.readyState !== 1 || !Number.isFinite(radius)) return;
    const radiusNm = Math.min(300, Math.max(1, Math.ceil(radius)));
    if (!force && radiusNm === lastReportedRadius) return;
    lastSocket = socket;
    lastReportedRadius = radiusNm;
    socket.send(
      JSON.stringify({ type: "viewport", radiusNm, localOnly: scene.isLocalOnly?.() ?? false }),
    );
  };
  const onKeyDown = (event) => {
    if (event.key?.toLowerCase() !== "l" || event.altKey || event.ctrlKey || event.metaKey) return;
    if (["input", "textarea", "select"].includes(event.target?.tagName?.toLowerCase())) return;
    if (!event.target?.isContentEditable) send(lastSocket, true);
  };
  documentRef?.addEventListener?.("keydown", onKeyDown);
  send.destroy = () => documentRef?.removeEventListener?.("keydown", onKeyDown);
  return send;
}

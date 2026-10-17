export function attachRadarCompassDisplay(documentRef, view) {
  const compass = documentRef?.querySelector?.("[data-radar-compass]");
  const rose = documentRef?.querySelector?.("[data-compass-rose]");
  const heading = documentRef?.querySelector?.("[data-compass-heading]");
  if (!compass || !rose || !heading) return () => {};

  const render = () => {
    const angle = view.northAngle?.() ?? 0;
    const azimuthDegrees = Number.isFinite(angle)
      ? ((Math.round((angle * 180) / Math.PI) % 360) + 360) % 360
      : 0;
    const degrees = (360 - azimuthDegrees) % 360;
    const value = String(degrees).padStart(3, "0");
    rose.setAttribute("transform", `rotate(${azimuthDegrees} 58 58)`);
    heading.textContent = value;
    compass.setAttribute(
      "aria-label",
      `Reset view. N E S W ${value}. Radar heading ${value} degrees`,
    );
  };

  const unsubscribe = view.onViewChange?.(render) ?? (() => {});
  render();
  return unsubscribe;
}

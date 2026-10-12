export function createOrbitRadarState(controls, radarCamera) {
  return {
    northAngle: () => controls.getAzimuthalAngle?.() ?? 0,
    onViewChange(listener) {
      const notify = () => listener(radarCamera.range());
      controls.addEventListener("change", notify);
      listener(radarCamera.range());
      return () => controls.removeEventListener("change", notify);
    },
    range: () => radarCamera.range(),
  };
}

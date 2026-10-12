export function createOrbitRadarControls(controls, radarCamera) {
  return {
    zoom: (factor) => radarCamera.zoomBy(factor),
    rotate(direction) {
      controls.rotateLeft(direction * (Math.PI / 12));
      controls.update();
    },
    rotateBy(angle) {
      controls.rotateLeft(-angle);
      controls.update();
    },
    orbitBy(azimuth, tilt) {
      controls.rotateLeft(-azimuth);
      controls.rotateUp(tilt);
      controls.update();
    },
    northAngle: () => controls.getAzimuthalAngle?.() ?? 0,
    onViewChange(listener) {
      const notify = () => listener(radarCamera.range());
      controls.addEventListener("change", notify);
      listener(radarCamera.range());
      return () => controls.removeEventListener("change", notify);
    },
    range: () => radarCamera.range(),
    tilt(direction) {
      controls.rotateUp(-direction * (Math.PI / 18));
      controls.update();
    },
  };
}

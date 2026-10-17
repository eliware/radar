export function configureRadarOrbitOrientation(camera, controls, screenUp) {
  const originalUp = { x: camera.up.x, y: camera.up.y, z: camera.up.z };
  const originalLookAt = camera.lookAt;
  const lookAt = originalLookAt.bind(camera);
  camera.up.set(0, 1, 0);
  camera.lookAt = (...args) => {
    const angle = controls.getAzimuthalAngle();
    camera.up.set(
      screenUp.x * Math.cos(angle) + screenUp.z * Math.sin(angle),
      0,
      -screenUp.x * Math.sin(angle) + screenUp.z * Math.cos(angle),
    );
    try {
      lookAt(...args);
    } finally {
      camera.up.set(0, 1, 0);
    }
  };
  return () => {
    camera.lookAt = originalLookAt;
    camera.up.set(originalUp.x, originalUp.y, originalUp.z);
  };
}

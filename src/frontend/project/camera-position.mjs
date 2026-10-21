export function createCameraProjector(THREE, camera) {
  const cameraPosition = new THREE.Vector3();
  const projectedPosition = new THREE.Vector3();
  return (position, width, height) => {
    if (camera?.matrixWorldInverse) {
      cameraPosition
        .set(position.x, position.y, position.z)
        .applyMatrix4(camera.matrixWorldInverse);
      const depth = -cameraPosition.z;
      if (depth < camera.near || depth > camera.far) return null;
    }
    projectedPosition.set(position.x, position.y, position.z).project(camera);
    return {
      x: ((projectedPosition.x + 1) * width) / 2,
      y: ((1 - projectedPosition.y) * height) / 2,
    };
  };
}

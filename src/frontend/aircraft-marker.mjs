export function createAircraftMarker(THREE) {
  const marker = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.55, 4),
    new THREE.MeshBasicMaterial({ color: 0xffc247 }),
  );
  marker.rotation.x = Math.PI / 2;
  return marker;
}

export function removeAircraftMarkers(scene, markers, icaos) {
  for (const icao of icaos) {
    scene.remove(markers.get(icao));
    markers.delete(icao);
  }
}

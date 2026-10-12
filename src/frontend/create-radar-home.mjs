export function createRadarHome(THREE, scene, updateRings) {
  const material = new THREE.MeshBasicMaterial({ color: 0x555555 });
  scene.add(new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 12), material));
  return (connected) => {
    material.color.setHex(connected ? 0x00ff41 : 0x555555);
    updateRings.setConnected(connected);
  };
}

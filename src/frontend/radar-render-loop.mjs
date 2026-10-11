export function createRadarRenderLoop({ renderer, scene, camera, container, windowRef, onFrame }) {
  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  const animate = () => {
    renderer.render(scene, camera);
    onFrame?.();
    frame = windowRef.requestAnimationFrame(animate);
  };
  let frame = windowRef.requestAnimationFrame(animate);
  windowRef.addEventListener("resize", resize);
  resize();
  return () => {
    windowRef.cancelAnimationFrame(frame);
    windowRef.removeEventListener("resize", resize);
  };
}

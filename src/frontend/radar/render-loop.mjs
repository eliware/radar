export function createRadarRenderLoop({ renderer, scene, camera, container, windowRef, onFrame }) {
  const resize = () => {
    const width = container.clientWidth;
    const height = container.clientHeight;
    if (!width || !height) return;
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
  };
  const animate = (time) => {
    renderer.render(scene, camera);
    onFrame?.(time);
    frame = windowRef.requestAnimationFrame(animate);
  };
  let frame = windowRef.requestAnimationFrame(animate);
  windowRef.addEventListener("resize", resize);
  const resizeObserver = windowRef.ResizeObserver ? new windowRef.ResizeObserver(resize) : null;
  resizeObserver?.observe(container);
  resize();
  return () => {
    windowRef.cancelAnimationFrame(frame);
    windowRef.removeEventListener("resize", resize);
    resizeObserver?.disconnect();
  };
}

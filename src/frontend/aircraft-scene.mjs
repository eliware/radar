import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { createRadarRenderer } from "./create-radar-renderer.mjs";
import { createRadarCamera } from "./radar-camera.mjs";
import { DEFAULT_RADAR_RANGE, selectDefaultRadarRange } from "./radar-range.mjs";
import { createRadarTargets } from "./radar-targets.mjs";
import { createRadarSceneOverlays } from "./radar-scene-overlays.mjs";
import { createAircraftMarker, removeAircraftMarkers } from "./aircraft-marker.mjs";
import { watchRadarTargets } from "./watch-radar-targets.mjs";

export function createAircraftScene({ container, location, elevationFeet, windowRef = window }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.05, 1000);
  camera.up.set(0, 0, -1);
  const renderer = createRadarRenderer({ THREE, windowRef });
  container.appendChild(renderer.domElement);
  const updateRings = createRadarSceneOverlays(THREE, scene);
  const home = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0x35d5a0 }),
  );
  scene.add(home);
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.target.set(0, 0, 0);
  controls.update();
  const markers = new Map();
  const targets = createRadarTargets();
  let autoZoom = true;
  const radarCamera = createRadarCamera({
    camera,
    controls,
    scene,
    element: renderer.domElement,
    windowRef,
    onManualZoom: () => (autoZoom = false),
    onRangeChange: updateRings,
  });
  radarCamera.setRange(DEFAULT_RADAR_RANGE);
  const stopTargetWatch = watchRadarTargets({
    targets,
    windowRef,
    onExpire: (expired) => {
      removeAircraftMarkers(scene, markers, expired);
      if (autoZoom) radarCamera.setRange(selectDefaultRadarRange(targets.distances()));
    },
  });
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
    frame = windowRef.requestAnimationFrame(animate);
  };
  let frame = windowRef.requestAnimationFrame(animate);
  windowRef.addEventListener("resize", resize);
  resize();
  return {
    update(aircraft) {
      const position = projectAircraftPosition(aircraft, location, elevationFeet);
      if (!position) return;
      const expired = targets.update(aircraft, Math.hypot(position.x, position.z));
      removeAircraftMarkers(scene, markers, expired);
      let marker = markers.get(aircraft.icao);
      if (!marker) {
        marker = createAircraftMarker(THREE);
        markers.set(aircraft.icao, marker);
        scene.add(marker);
      }
      marker.position.set(position.x, position.y, position.z);
      marker.rotation.y = Math.PI - ((aircraft.trackDegrees ?? 0) * Math.PI) / 180;
      if (autoZoom) {
        const nextRange = selectDefaultRadarRange(targets.distances());
        if (nextRange !== radarCamera.range()) radarCamera.setRange(nextRange);
      }
    },
    reset() {
      scene.rotation.y = 0;
      autoZoom = true;
      radarCamera.setRange(selectDefaultRadarRange(targets.distances()));
    },
    destroy() {
      windowRef.cancelAnimationFrame(frame);
      windowRef.removeEventListener("resize", resize);
      stopTargetWatch();
      radarCamera.dispose();
      controls.dispose();
      renderer.dispose();
      container.replaceChildren();
    },
  };
}

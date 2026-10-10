import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { projectAircraftPosition } from "./aircraft-space-position.mjs";
import { createRadarRenderer } from "./create-radar-renderer.mjs";
import { attachMobileRadarGestures, hasCoarsePointer } from "./mobile-radar-gestures.mjs";

export function createAircraftScene({ container, location, elevationFeet, windowRef = window }) {
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  const camera = new THREE.PerspectiveCamera(48, 1, 0.05, 1000);
  camera.up.set(0, 0, -1);
  camera.position.set(0, 25, 0);
  const renderer = createRadarRenderer({ THREE, windowRef });
  container.appendChild(renderer.domElement);
  makeRadarRings(scene);
  const home = new THREE.Mesh(
    new THREE.SphereGeometry(0.18, 16, 12),
    new THREE.MeshBasicMaterial({ color: 0x35d5a0 }),
  );
  scene.add(home);
  const controls = new OrbitControls(camera, renderer.domElement);
  const isMobile = hasCoarsePointer(windowRef);
  let detachGestures = () => {};
  if (isMobile) {
    controls.enablePan = false;
    controls.enableRotate = false;
    detachGestures = attachMobileRadarGestures(renderer.domElement, {
      onZoom: () => {},
      onRotate: (angle) => {
        scene.rotation.y += angle;
      },
    });
  }
  controls.target.set(0, 0, 0);
  controls.update();
  const markers = new Map();
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
      let marker = markers.get(aircraft.icao);
      if (!marker) {
        marker = makeAircraftMarker();
        markers.set(aircraft.icao, marker);
        scene.add(marker);
      }
      marker.position.set(position.x, position.y, position.z);
      marker.rotation.y = Math.PI - ((aircraft.trackDegrees ?? 0) * Math.PI) / 180;
    },
    reset() {
      scene.rotation.y = 0;
      camera.position.set(0, 25, 0);
      controls.target.set(0, 0, 0);
      controls.update();
    },
    destroy() {
      windowRef.cancelAnimationFrame(frame);
      windowRef.removeEventListener("resize", resize);
      detachGestures();
      controls.dispose();
      renderer.dispose();
      container.replaceChildren();
    },
  };
}

function makeAircraftMarker() {
  const marker = new THREE.Mesh(
    new THREE.ConeGeometry(0.16, 0.55, 4),
    new THREE.MeshBasicMaterial({ color: 0xffc247 }),
  );
  marker.rotation.x = Math.PI / 2;
  return marker;
}

function makeRadarRings(scene) {
  for (let range = 5; range <= 60; range += 5) {
    const major = range % 10 === 0;
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(range, major ? 0.055 : 0.025, 6, 192),
      new THREE.MeshBasicMaterial({ color: major ? 0x18516b : 0x103548 }),
    );
    ring.rotation.x = Math.PI / 2;
    scene.add(ring);
  }
}

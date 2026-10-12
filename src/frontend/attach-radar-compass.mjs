export function attachRadarCompass(documentRef, view) {
  const compass = documentRef.querySelector?.("[data-radar-compass]");
  const north = documentRef.querySelector?.("[data-compass-north]");
  const joystick = documentRef.querySelector?.("[data-compass-joystick]");
  if (!compass || !north || !joystick) return () => {};
  let northDrag = null;
  let joystickDrag = null;

  function renderNorth() {
    const width = compass.clientWidth || 1;
    const height = compass.clientHeight || width;
    const angle = view.northAngle?.() ?? 0;
    const radius = width * 0.46;
    north.style.left = `${width / 2 + Math.sin(angle) * radius}px`;
    north.style.top = `${height / 2 - Math.cos(angle) * radius}px`;
  }

  const northAngle = (event) => {
    const rect = compass.getBoundingClientRect();
    return Math.atan2(
      event.clientX - rect.left - rect.width / 2,
      rect.height / 2 - event.clientY + rect.top,
    );
  };
  const startNorth = (event) => {
    northDrag = { id: event.pointerId, angle: northAngle(event) };
    north.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  };
  const moveNorth = (event) => {
    if (northDrag?.id !== event.pointerId) return;
    const angle = northAngle(event);
    view.rotateBy?.(normalizeAngle(angle - northDrag.angle));
    northDrag.angle = angle;
    event.preventDefault();
  };
  const startJoystick = (event) => {
    joystickDrag = { id: event.pointerId, x: event.clientX, y: event.clientY };
    joystick.setPointerCapture?.(event.pointerId);
    event.preventDefault();
  };
  const moveJoystick = (event) => {
    if (joystickDrag?.id !== event.pointerId) return;
    const dx = event.clientX - joystickDrag.x;
    const dy = event.clientY - joystickDrag.y;
    joystickDrag.x = event.clientX;
    joystickDrag.y = event.clientY;
    const rect = compass.getBoundingClientRect();
    const offsetX = event.clientX - rect.left - rect.width / 2;
    const offsetY = event.clientY - rect.top - rect.height / 2;
    const length = Math.hypot(offsetX, offsetY) || 1;
    const scale = Math.min(1, 12 / length);
    joystick.style.transform = `translate(${offsetX * scale}px, ${offsetY * scale}px)`;
    view.orbitBy?.(dx * 0.04, dy * 0.04);
    event.preventDefault();
  };
  const end = (event) => {
    if (northDrag?.id === event.pointerId) northDrag = null;
    if (joystickDrag?.id === event.pointerId) {
      joystickDrag = null;
      joystick.style.transform = "";
    }
  };
  const unsubscribe = view.onViewChange?.(renderNorth) ?? (() => {});
  north.addEventListener("pointerdown", startNorth);
  north.addEventListener("pointermove", moveNorth);
  joystick.addEventListener("pointerdown", startJoystick);
  joystick.addEventListener("pointermove", moveJoystick);
  for (const element of [north, joystick]) {
    element.addEventListener("pointerup", end);
    element.addEventListener("pointercancel", end);
  }
  renderNorth();
  return () => {
    unsubscribe();
    north.removeEventListener("pointerdown", startNorth);
    north.removeEventListener("pointermove", moveNorth);
    joystick.removeEventListener("pointerdown", startJoystick);
    joystick.removeEventListener("pointermove", moveJoystick);
    for (const element of [north, joystick]) {
      element.removeEventListener("pointerup", end);
      element.removeEventListener("pointercancel", end);
    }
  };
}

function normalizeAngle(angle) {
  if (angle > Math.PI) return angle - 2 * Math.PI;
  if (angle < -Math.PI) return angle + 2 * Math.PI;
  return angle;
}

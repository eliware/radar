const headingFromEvent = (event) => {
  if (Number.isFinite(event.webkitCompassHeading)) return event.webkitCompassHeading;
  if (event.absolute === true && Number.isFinite(event.alpha)) return 360 - event.alpha;
  return null;
};

function attachMobileCompassTracking(documentRef, windowRef, view) {
  const button = documentRef?.querySelector?.("[data-compass-follow]");
  if (!button || !windowRef?.addEventListener) return () => {};
  let active = false;
  let pending = false;
  let permissionVersion = 0;
  const setStatus = (text) => {
    button.textContent = text;
    button.setAttribute("aria-pressed", String(active));
  };
  const onHeading = (event) => {
    const heading = headingFromEvent(event);
    if (active && heading !== null) {
      const normalized = ((heading % 360) + 360) % 360;
      view.setRotation?.((normalized * Math.PI) / 180);
    }
  };
  const stop = () => {
    permissionVersion += 1;
    pending = false;
    active = false;
    windowRef.removeEventListener("deviceorientation", onHeading);
    setStatus("FOLLOW");
  };
  const start = async () => {
    if (windowRef.isSecureContext !== true) return setStatus("HTTPS REQUIRED");
    const sensor = windowRef.DeviceOrientationEvent;
    if (!sensor) return setStatus("NO COMPASS");
    if (typeof sensor.requestPermission === "function") {
      pending = true;
      const currentPermissionVersion = ++permissionVersion;
      try {
        if ((await sensor.requestPermission()) !== "granted") {
          if (permissionVersion === currentPermissionVersion) {
            pending = false;
            setStatus("PERMISSION BLOCKED");
          }
          return;
        }
      } catch {
        if (permissionVersion === currentPermissionVersion) {
          pending = false;
          setStatus("PERMISSION BLOCKED");
        }
        return;
      }
      if (permissionVersion !== currentPermissionVersion || !pending) return;
      pending = false;
    }
    active = true;
    setStatus("PHONE ACTIVE");
    windowRef.addEventListener("deviceorientation", onHeading);
  };
  const onClick = () => (active || pending ? stop() : start());
  button.addEventListener("click", onClick);
  return () => {
    stop();
    button.removeEventListener("click", onClick);
  };
}
export default attachMobileCompassTracking;

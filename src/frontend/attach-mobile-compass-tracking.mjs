const headingFromEvent = (event) => {
  if (Number.isFinite(event.webkitCompassHeading)) return event.webkitCompassHeading;
  if (event.absolute === true && Number.isFinite(event.alpha)) return 360 - event.alpha;
  return null;
};

export function attachMobileCompassTracking(documentRef, windowRef, view) {
  const button = documentRef?.querySelector?.("[data-compass-follow]");
  if (!button || !windowRef?.addEventListener) return () => {};
  let active = false;
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
    active = false;
    windowRef.removeEventListener("deviceorientation", onHeading);
    setStatus("FOLLOW PHONE");
  };
  const start = async () => {
    if (windowRef.isSecureContext === false) return setStatus("HTTPS REQUIRED");
    const sensor = windowRef.DeviceOrientationEvent;
    if (!sensor) return setStatus("NO COMPASS");
    if (typeof sensor.requestPermission === "function") {
      try {
        if ((await sensor.requestPermission()) !== "granted")
          return setStatus("PERMISSION BLOCKED");
      } catch {
        return setStatus("PERMISSION BLOCKED");
      }
    }
    active = true;
    setStatus("FOLLOWING PHONE");
    windowRef.addEventListener("deviceorientation", onHeading);
  };
  const onClick = () => (active ? stop() : start());
  button.addEventListener("click", onClick);
  return () => {
    stop();
    button.removeEventListener("click", onClick);
  };
}

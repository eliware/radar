export async function startDashboard({ document, fetchData, WebSocketClass, createScene }) {
  const status = document.querySelector("[data-status]");
  const container = document.querySelector("[data-scene]");
  if (!container) return null;
  try {
    const config = await readJson(fetchData, "/api/config");
    const home = document.querySelector("[data-home]");
    home.textContent = config.location
      ? `${config.location.latitude.toFixed(4)}°, ${config.location.longitude.toFixed(4)}° · ${config.elevationFeet} ft MSL`
      : `Set MY_LOCATION in .env · ${config.elevationFeet} ft MSL`;
    const scene = createScene({
      container,
      location: config.location,
      elevationFeet: config.elevationFeet,
      onMode: (mode, isMobile) => updateViewLabels(document, mode, isMobile),
    });
    const aircraft = await readJson(fetchData, "/api/aircraft");
    aircraft.forEach((item) => scene.update(item));
    const socket = new WebSocketClass(webSocketUrl(document.location));
    socket.onopen = () => {
      status.textContent = "Live feed connected.";
    };
    socket.onclose = () => {
      status.textContent = "Live feed disconnected.";
    };
    socket.onerror = () => {
      status.textContent = "Live feed error.";
    };
    socket.onmessage = (event) => updateScene(scene, event.data);
    const reset = document.querySelector("[data-reset]");
    reset?.addEventListener("click", () => scene.reset());
    status.textContent = `${scene.mode ?? "3D"} radar ready. ${aircraft.length} aircraft tracked.`;
    return { scene, socket };
  } catch (error) {
    status.textContent = `Radar could not start: ${error.message}`;
    return null;
  }
}

function updateViewLabels(document, mode, isMobile) {
  const title = document.querySelector("[data-view-title]");
  const hint = document.querySelector("[data-controls-hint]");
  if (title) title.textContent = mode === "2D" ? "LOCAL 2D RADAR" : "LOCAL 3D SPACE";
  if (hint && isMobile)
    hint.textContent = "Pinch to zoom · Twist with two fingers to rotate · Home stays centered";
  else if (hint && mode === "2D") hint.textContent = "Drag to pan · Scroll to zoom · North is up";
}

async function readJson(fetchData, path) {
  const response = await fetchData(path);
  if (!response.ok) throw new Error(`Request failed: ${path}`);
  return response.json();
}

function webSocketUrl(location) {
  const protocol = location.protocol === "https:" ? "wss:" : "ws:";
  return `${protocol}//${location.host}/ws`;
}

function updateScene(scene, data) {
  let aircraft;
  try {
    aircraft = JSON.parse(data);
  } catch {
    return;
  }
  scene.update(aircraft);
}

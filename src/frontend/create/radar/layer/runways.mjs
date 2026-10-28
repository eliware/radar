export function createRunwayVisibility(onChange = () => {}) {
  const state = { runwaysVisible: true, extensionsVisible: true, baseLegsVisible: true };
  function setVisible(layer, value) {
    if (!(layer in state)) return;
    state[layer] = Boolean(value);
    onChange({ ...state });
  }
  return {
    isRunwaysVisible: () => state.runwaysVisible,
    isExtensionsVisible: () => state.extensionsVisible,
    isBaseLegsVisible: () => state.baseLegsVisible,
    setVisible,
    setRunwaysVisible: (value) => setVisible("runwaysVisible", value),
    setExtensionsVisible: (value) => setVisible("extensionsVisible", value),
    setBaseLegsVisible: (value) => setVisible("baseLegsVisible", value),
  };
}

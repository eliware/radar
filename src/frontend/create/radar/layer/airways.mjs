export function createAirwayVisibility(onChange = () => {}) {
  const visible = { Q: true, J: true, V: true };
  function setVisible(type, value) {
    if (!(type in visible)) return;
    visible[type] = Boolean(value);
    onChange({ ...visible });
  }
  return {
    isVisible: (type) => Boolean(visible[type]),
    setVisible,
  };
}

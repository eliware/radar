const EDITABLE = new Set(["input", "textarea", "select"]);

export function attachRadarLayerShortcuts(documentRef, { airways, references, runways }) {
  const actions = {
    q: () => airways.setVisible("Q", !airways.isVisible("Q")),
    j: () => airways.setVisible("J", !airways.isVisible("J")),
    v: () => airways.setVisible("V", !airways.isVisible("V")),
    a: () => references.setAirportsVisible(!references.isAirportsVisible()),
    n: () => references.setNavaidsVisible(!references.isNavaidsVisible()),
    r: () => runways.setRunwaysVisible(!runways.isRunwaysVisible()),
    e: () => runways.setExtensionsVisible(!runways.isExtensionsVisible()),
    b: () => runways.setBaseLegsVisible(!runways.isBaseLegsVisible()),
  };
  const onKeyDown = (event) => {
    const action = actions[event.key?.toLowerCase()];
    if (!action || event.altKey || event.ctrlKey || event.metaKey) return;
    if (EDITABLE.has(event.target?.tagName?.toLowerCase()) || event.target?.isContentEditable)
      return;
    event.preventDefault();
    action();
  };
  documentRef?.addEventListener?.("keydown", onKeyDown);
  return () => documentRef?.removeEventListener?.("keydown", onKeyDown);
}

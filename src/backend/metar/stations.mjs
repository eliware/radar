export function parseMetarStations(value = "KLEW,KPWM,KBXM") {
  return [
    ...new Set(
      value
        .split(",")
        .map((code) => code.trim().toUpperCase())
        .filter((code) => /^[A-Z0-9]{4}$/.test(code)),
    ),
  ];
}

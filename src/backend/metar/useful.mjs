function hasUsefulMetarData(decoded) {
  return !Object.values(decoded).every(
    (value) => value === "—" || value === false || value == null,
  );
}
export default hasUsefulMetarData;

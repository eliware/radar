export function isValidRangeBand(minRangeNm, maxRangeNm) {
  return (
    Number.isFinite(minRangeNm) &&
    Number.isFinite(maxRangeNm) &&
    minRangeNm >= 0 &&
    maxRangeNm > minRangeNm &&
    maxRangeNm <= 300
  );
}

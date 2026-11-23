function selectMetarObservationDate(dayNumber, now) {
  let month = now.getUTCMonth();
  let year = now.getUTCFullYear();
  if (dayNumber > now.getUTCDate()) {
    const previousMonth = new Date(Date.UTC(year, month - 1, 1));
    month = previousMonth.getUTCMonth();
    year = previousMonth.getUTCFullYear();
  }
  while (dayNumber > daysInMonth(year, month)) {
    const previousMonth = new Date(Date.UTC(year, month - 1, 1));
    month = previousMonth.getUTCMonth();
    year = previousMonth.getUTCFullYear();
  }
  return new Date(Date.UTC(year, month, dayNumber));
}

function daysInMonth(year, month) {
  return new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
}
export default selectMetarObservationDate;

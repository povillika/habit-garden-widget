export function getToday() {
  return new Date().toISOString().split('T')[0];
}

export function daysBetween(dateStr1, dateStr2) {
  const d1 = new Date(dateStr1 + 'T00:00:00');
  const d2 = new Date(dateStr2 + 'T00:00:00');
  return Math.floor((d2 - d1) / (1000 * 60 * 60 * 24));
}

export function isToday(dateStr) {
  return dateStr === getToday();
}
